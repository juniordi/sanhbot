var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var cheerio = require('cheerio') //lib de thao tac voi HTML DOM nhu jQuery
var app = express()

app.set('port', (process.env.PORT || 8080))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

var PAGE_ACCESS_TOKEN = "EAASYDIKLwzQBABj9T2HVFTeb4UanDDZBtecPcUIQINXv8eMU2ZBD0XiO5nLc1c1aJbvwkf0OEKeDAn4eTJK4hBlJTLcnHNw84XJSZCUzMcifPiIE3gsBFU8oSrx6ZBitPLTRGy1LZAlZCmUJ8jYV9ZCwc7a93xhzbGotqkfw3pKCQZDZD"

//data
var a = [
    {
        "description": "smile",
        "keyword": [[" :) ", " :D "]],
        "answer": [":)"]
    },
    {
        "description": "like",
        "keyword": [" (y) "],
        "answer": ["(y)"]
    },
    {
        "description": "help",
        "keyword": [" help ", " giúp "],
        "answer": ["function:help"]
    },
    {
        "description": "chào hỏi",
        "keyword": [[" xin chào ", " chào bạn ", " chào anh ", " chào chị ", " chào mày ", " chào ", " hello ", " hey ", " hi ", " 2 ", " how are you ", " how do you do ", " này "]],
        "answer": ["Xin chào! Tôi là một chú ROBOT. Rất vui khi được chat với bạn. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé :)"]
    },
    {
        "description": "hỏi: bạn là ai",
        "keyword": [[" mày là ai ", " bạn là ai ", " anh là ai ", " chị là ai ", " chú là ai ", " bác là ai ", " cụ là ai "]],
        "answer": ["Tôi là một chú ROBOT kekhaithue"]
    },
    {
        "description": "hỏi: tôi là ai",
        "keyword": [[" tao là ai ", " tôi là ai ", " tớ là ai ", " mình là ai "]],
        "answer": ["Bạn là khách của tôi"]
    },
    {
        "description": "hỏi: ai làm ra mày",
        "keyword": [[" ai làm ra ", " ai tạo ra ", " ai lập trình "]],
        "answer": [":) I can't talk right now"]
    },
    
    {
        "description": "Người dùng nói OK/ yeah",
        "keyword": [[" ok ", " uki ", " yeah "]],
        "answer": ["Cool. Bạn muốn đặt câu hỏi nào nữa không?"]
    },
    {
        "description": "Người dùng nói thế à/ thế á",
        "keyword": [[" thế à ", " thế á "]],
        "answer": ["Yeah! Bạn muốn đặt câu hỏi nào nữa không?"]
    },
    {
        "description": "Người dùng khen",
        "keyword": [[" giỏi đấy ", " giỏi lắm ", " khá khen ", " good ", " tốt "]],
        "answer": ["Cám ơn bạn. Ngại quá <3"]
    },
    {
        "description": "trả lời khi nói cám ơn",
        "keyword": [[" thanks ", " thankyou ", " thank ", " thank you ", " thank-you ", " cám ơn ", " cảm ơn "]],
        "answer": ["Cám ơn bạn đã sử dụng kekhaithue fanpage"]
    },
    
    {
        "description": "Bạn có thể làm gì?",
        "keyword": [" có thể ", [" làm được gì ", " làm gì ", " làm được những gì ", " làm những gì "]],
        "answer": ["Tôi có thể hướng dẫn căn bản cách khai và nộp thuế. Gõ \"help\" hoặc \"trợ giúp\" để biết cách sử dụng nhé"]
    },
    {
        "description": "hỏi chung chung về Phần mềm",
        "keyword": [" phần mềm "],
        "answer": ["Tôi không hiểu ý bạn. Bạn hãy hỏi nhưng câu cụ thể như: HTKK là gì? Tải HTKK ở đâu? Phiên bản HTKK hiện là bao nhiêu? iTaxViewer là gì? Cài java để làm gì? ..."]
    },
    {
        "description": "hỏi chung chung về Phần mềm",
        "keyword": [" phần mềm teamviewer ", " teamviewer "],
        "answer": ["Teamviewer là phần mềm dùng để điều khiển từ xa, hiện tôi không hỗ trợ được những vấn đề liên quan đến phần mềm này"]
    },
    {
        "description": "Số PIN là gì",
        "keyword": [[" số pin là gì ", " pin là gì ", " mã pin là gì "]],
        "answer": ["Số PIN hay mã PIN là mật khẩu của chữ ký số"]
    },
    {
        "description": "báo sai số PIN",
        "keyword": [[" pin sai ", " sai pin ", " sai số pin "]],
        "answer": ["Bạn đăng nhập vào phần mềm quản lý bút ký để kiểm tra lại số PIN. Nếu không nhớ số PIN hãy liên lạc với công ty cung cấp chữ ký số"]
    },
    
    {
        "description": "hỏi có được đổi tên file tk không",
        "keyword": [[" đổi tên file ", " đổi tên tệp tờ khai ", " đổi tên tệp tk ", " đổi tên tờ khai ", " đổi tên tk "]],
        "answer": ["Bạn có thể đổi tên file tờ khai xml khi gửi qua trang kekhaithue.gdt.gov.vn", "Nếu gửi tờ khai qua trang tncnonline.com.vn thì bạn không được đổi tên file"]
    },
    {
        "description": "gửi tk pdf",
        "keyword": [[" tờ khai pdf ", " tk pdf "]],
        "answer": ["Tờ khai định dạng pdf chỉ được gửi qua trang kekhaithue đến hết tháng 3/2015. Sau thời điểm này mọi tờ khai gửi phải là định dạng xml. Riêng các bảng kê hoặc thuyết minh BCTC thì vẫn gửi văn bản định dạng word hoặc excel"]
    },
    {
        "description": "gửi tk xml",
        "keyword": [[" tờ khai xml ", " tk xml "]],
        "answer": ["Tờ khai định dạng xml bắt đầu được gửi từ tháng 4/2015. Riêng các bảng kê hoặc thuyết minh BCTC thì vẫn gửi văn bản định dạng word hoặc excel. Để đọc file tờ khai này bạn cài phần mềm iTaxViewer"]
    },
    {
        "description": "cài đặt ngày tháng",
        "keyword": [[" ngày tháng ", " ngày giờ "], [" cài đặt ", " thiết lập "]],
        "answer": ["Bạn làm tương tự như này http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-sai-ngay-thang-nam-sinh.html"]
    },
    {
        "description": "tra cứu mst",
        "keyword": [[" tra cứu mst ", " tra cứu mã số thuế ", " tra mst ", " tra mã số thuế "]],
        "answer": ["Bạn vào http://adf.ly/1bRiIX hoặc http://adf.ly/1bRiNn để tra cứu mst"]
    },
    {
        "description": "cách ký điện tử",
        "keyword": [" ký điện tử "],
        "answer": ["Bạn xem cách ký tờ khai tại đây https://youtu.be/IMeg6n6reI0, hoặc cách ký giấy nộp tiền tại đây https://youtu.be/ngmUka21pZI"]
    }


]
//data catalogue
var a_catalogue = [
    {
        "description": "htkk là gì",
        "catalogue":[" htkk "],
        "keyword": [[" là gì ", " giới thiệu ", " là cái gì "]],
        "answer": ["Ứng dụng HTKK thuộc bản quyền của Tổng cục thuế. Đây là phần mềm được phát hành miễn phí cho các cơ sở SXKD nhằm hỗ trợ các đơn vị trong quá trình kê khai thuế", "Bạn có thể hỏi: phiên bản mới nhất của HTKK là bao nhiêu? để biết phiên bản mới nhất", "Tải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ"]
    },
    {
        "description": "phiên bản htkk",
        "catalogue":[" htkk "],
        "keyword": [[" phiên bản ", " version ", " bản ", " bao nhiêu "]],
        "answer": ["function:htkk_version"]
    },
    {
        "description": "download htkk",
        "catalogue":[" htkk "],
        "keyword": [[" download ", " tải "]],
        "answer": ["Bạn tải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ"]
    },
    {
        "description": "sử dụng htkk lỗi",
        "catalogue":[" htkk "],
        "keyword": [[" lập tk ", " lập tờ khai ", " làm tk ", " làm tờ khai ", " khai tk ", " khai tờ khai "], " lỗi "],
        "answer": ["Bạn hãy mô tả chi tiết lỗi nhé. VD: vào HTKK báo lỗi error, lập tk bổ sung trên htkk báo lỗi error, không vào được htkk, bctc không nhập được số âm trên htkk..."]
    },
    {
        "description": "vào htkk báo lỗi error",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", " error "],
        "answer": ["Bạn xem lại quyền user trên máy tính sử dụng đã đủ quyền chưa? Hoặc bạn phải restart lại máy tính sau khi cài đặt HTKK"]
    },
    {
        "description": "lập tk bổ sung trên htkk báo lỗi error",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", " error ", [" tk ", " tờ khai "], [" bổ sung ", " bổ xung "]],
        "answer": ["Vào lập tk bổ sung trên HTKK bị lỗi error thì bạn xem lại định dạng ngày tháng trên máy tính nhé","Làm tương tự như này http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-sai-ngay-thang-nam-sinh.html"]
    },
    {
        "description": "HTKK không nhập được số âm",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", [" không nhập được số âm ", " không nhập số âm được "]],
        "answer": ["Bạn khắc phục như ở đây http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-khong-nhap-uoc-so-am-tren.html. Nếu vẫn không nhập được số âm thì lỗi do HTKK"]
    },
    {
        "description": "HTKK không nhập được số âm trên BCTC",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", [" không nhập được số âm ", " không nhập số âm được "], [" báo cáo tài chính ", " bctc "]],
        "answer": ["Bạn khắc phục như ở đây http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-khong-nhap-uoc-so-am-tren.html. Nếu vẫn không nhập được số âm thì lỗi do HTKK"]
    },
    {
        "description": "không vào được HTKK",
        "catalogue": [" htkk "],
        "keyword": [" lỗi ", [" không vào ", " đứng im "]],
        "answer": ["Bạn khắc phục như ở đây http://lehoangdieu.blogspot.com/2016/02/nhap-mst-nhung-khong-vao-uoc-htkk.html"]
    },
    {
        "description": "HTKK báo lỗi chưa đến thời kỳ làm bc",
        "catalogue": [" htkk "],
        "keyword": [" lỗi ", [" chưa đến thời kỳ ", " chưa đến kỳ "], [" làm báo cáo ", " làm bc "]],
        "answer": ["Bạn xem lại năm tài chính đã khai báo trên HTKK (vào HỆ THỐNG > THÔNG TIN DN) hoặc ngày tháng trên máy tính bạn đang bị sai"]
    },
    {
        "description": "Cài đặt ngày tháng để sử dụng HTKK như ý",
        "catalogue": [" htkk "],
        "keyword": [[" ngày tháng ", " ngày giờ "], [" cài đặt ", " thiết lập "]],
        "answer": ["Bạn làm tương tự như này http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-sai-ngay-thang-nam-sinh.html"]
    },
    {
        "description": "Cài đặt ngày tháng để sử dụng HTKK như ý",
        "catalogue": [" htkk "],
        "keyword": [[" cài ", " setup "]],
        "answer": ["Bạn tải HTKK tại http://adf.ly/1aAYdJ, cài đặt thì dễ lắm, cứ Next next next OK là xong :)"]
    },


    {
        "description": "itaxviewer là gì",
        "catalogue":[[" itaxviewer ", " itaxview ", " itax "]],
        "keyword": [[" là gì ", " giới thiệu ", " là cái gì "]],
        "answer": ["iTaxViewer là ứng dụng hỗ trợ đọc, xác minh tờ khai, thông báo thuế định dạng XML. Tải phiên bản mới nhất tại đây http://adf.ly/1aAYfe"]
    },
    {
        "description": "phiên bản itaxviewer",
        "catalogue":[[" itaxviewer ", " itaxview ", " itax "]],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Tôi chưa cập nhật phiên bản mới nhất của iTaxViewer là bao nhiêu, nhưng bạn có thể tải phiên bản mới nhất tại http://adf.ly/1aAYfe"]
    },
    {
        "description": "download itaxviewer",
        "catalogue":[[" itaxviewer ", " itaxview ", " itax "]],
        "keyword": [[" download ", " tải "]],
        "answer": ["Tải phiên bản mới nhất itaxviewer tại http://adf.ly/1aAYfe"]
    },
    {
        "description": "ihtkk là gì",
        "catalogue": [" ihtkk ", " web kekhaithue ", " web kê khai ", " website kekhaithue ", " website kê khai ", " web nhantokhai ", " website nhantokhai"],
        "keyword": [[" là gì ", " giới thiệu ", " là cái gì ", " website ", " trang web "]],
        "answer": ["iHTKK là hệ thống kê khai thuế, nộp tờ khai thuế thông qua trang web của Tổng Cục Thuế http://kekhaithue.gdt.gov.vn"]
    },
    {
        "description": "phiên bản ihtkk",
        "catalogue": [" ihtkk "],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Bạn vào trang http://kekhaithue.gdt.gov.vn và xem góc trên phải của trang để biết phiên bản hiện tại ihtkk nhé.\nTôi rất tiếc vì sự bất tiện này"]
    },
    {
        "description": "download ihtkk",
        "catalogue": [" ihtkk "],
        "keyword": [[" download ", " tải "]],
        "answer": ["iHTKK là hệ thống kê khai thuế, nộp tờ khai thuế thông qua trang web của Tổng Cục Thuế http://kekhaithue.gdt.gov.vn. Bạn không cần download :)"]
    },
    {
        "description": "chức năng của java",
        "catalogue": [" java "],
        "keyword": [[" chức năng ", " mục đích ", " tác dụng "], " cài ", [" làm gì ", " để làm gì ", " sao "]],
        "answer": ["Java có tác dụng trong khai và nộp thuế điện tử: Dùng để chọn tệp tờ khai, ký tệp tờ khai, ký giấy nộp tiền và xác nhận để đổi mật khẩu"]
    },
    {
        "description": "cài đặt java",
        "catalogue": [" java "],
        "keyword": [[" cài ", " setup ", " thiết lập ", " cấu hình "]],
        "answer": ["Bạn xem hướng dẫn cài và cấu hình java ở đây nhé http://lehoangdieu.blogspot.com/2016/02/thiet-lap-java-e-khai-nop-thue.html"]
    },
    {
        "description": "nâng cấp java",
        "catalogue": [" java "],
        "keyword": [[" nâng cấp ", " update "]],
        "answer": ["Bạn xem khi nào phải nâng cấp và cách nâng cấp java ở đây https://youtu.be/sAp46t5dxFY"]
    },
    {
        "description": "lỗi java",
        "catalogue": [" java "],
        "keyword": [[" lỗi ", " trục trặc "]],
        "answer": ["Nếu java bị lỗi bạn sẽ: Không chọn được tệp tờ khai, không ký được tệp tờ khai, không ký được giấy nộp tiền và không đổi được mật khẩu. Bạn xem hướng dẫn cài và cấu hình java ở đây nhé http://lehoangdieu.blogspot.com/2016/02/thiet-lap-java-e-khai-nop-thue.html"]
    },


    {
        "description": "chữ ký số là gì",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" là gì ", " là cái gì "]],
        "answer": ["Chữ ký số còn được gọi là chứng thư số là một con dấu để xác nhận văn bản này là của của Doanh nghiệp sử dụng để ký vào văn bản. Chữ ký số có hình dạng như một chiếc USB được gọi là USB Token"]
    },
    {
        "description": "chữ ký số lưu những thông tin gì",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" có gì ", " lưu gì ", " thông tin "]],
        "answer": ["Thông tin có trong chữ ký số:\n- Tên của Doanh nghiệp bao gồm: Mã số thuế, Tên Công ty… \n- Số hiệu của chứng thư số (số serial) \n- Thời hạn có hiệu lực của chứng thư số \n- Tên của tổ chức chứng thực chữ ký số \n..."]
    },
    {
        "description": "mua chữ ký số của ai",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" mua ", " bán "], [" của ai ", " của công ty nào ", " ở đâu ", " chỗ nào ", " nơi nào "]],
        "answer": ["Bạn xem danh sách các công ty cung cấp chứng thư số ở đây nhé http://adf.ly/1aE2UO"]
    },
    {
        "description": "Danh sách các công ty cung cấp chữ ký số",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" danh sách công ty ", " danh sách đơn vị ", " danh mục đơn vị ", " danh mục công ty ", " danh sách các công ty ", " danh sách các đơn vị ", " danh sách các đơn vị ", " danh mục các đơn vị "]],
        "answer": ["Bạn xem danh sách các công ty cung cấp chứng thư số ở đây nhé http://adf.ly/1aE2UO"]
    },
    {
        "description": "cài đặt chứng thư số",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" cài ", " setup ", " install "]],
        "answer": ["Bạn vào trong chữ ký số (sử dụng như 1 USB), tìm phần mềm cài đặt trong đó. Hoặc vào website của đơn vị cung cấp chữ ký số để tải phần mềm quản lý chữ ký số. Gõ: danh sách công ty cung cấp bút ký để xem danh sách các công ty cung cấp"]
    },



    {
        "description": "phần mềm TNCN",
        "catalogue": [" phần mềm tncn "],
        "keyword": [[" phiên bản ", " download ", " tải ", " là gì "]],
        "answer": ["Hiện nay phần mềm TNCN đã ngừng cung cấp. Để cấp mst cá nhân qua cơ quan chi trả bạn dùng phần mềm HTQT TNCN"]
    },


    {
        "description": "Đăng ký mst cá nhân",
        "catalogue": [[" mst cá nhân ", " mã số thuế cá nhân "]],
        "keyword": [[" đăng ký ", " cấp "]],
        "answer": ["Bạn dùng phần mềm HTQT TNCN (Hỗ trợ quyết toán TNCN) > Chọn ĐĂNG KÝ THUẾ QUA CQCT, sau đó kết xuất ra file xml (không được đổi tên file) rồi gửi qua trang tncnonline.com.vn. Sau đó in 1 bản có đóng dấu gửi đến cơ quan thuế"]
    },


    {
        "description": "HTQT TNCN là gì",
        "catalogue": [" htqt tncn "],
        "keyword": [[" là gì ", " là cái gì ", " giới thiệu "]],
        "answer": ["HTQT TNCN (Hỗ trợ quyết toán TNCN) là phần mềm dùng để khai hồ sơ quyết toán thuế TNCN và hồ sơ xin cấp MST cá nhân qua cơ quan chi trả. Download tại http://adf.ly/1bPQhy"]
    },
    {
        "description": "phiên bản HTQT TNCN",
        "catalogue": [" htqt tncn "],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Rất tiếc tôi không cập nhập phiên bản HTQT TNCN. Bạn vào đây để download phiên bản mới nhất nhé http://adf.ly/1bPQhy"]
    },
    {
        "description": "Download HTQT TNCN",
        "catalogue": [" htqt tncn "],
        "keyword": [[" download ", " tải "]],
        "answer": ["Bạn vào đây để download HTQT TNCN phiên bản mới nhất nhé http://adf.ly/1bPQhy"]
    },


    {
        "description": "tra cứu tiểu mục",
        "catalogue": [" tiểu mục "],
        "keyword": [" tiểu mục "],
        "answer": ["function:search_tmuc"]
    },

    {
        "description": "tỷ lệ tính tiền chậm nộp",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [" tỷ lệ "],
        "answer": ["Từ hạn nộp đến 30/6/2013: Tính theo tỷ lệ 0,05% (quy định của Luật số 78/2006/QH11)", "Từ ngày 1/7/2013 đến 31/12/2014: tỷ lệ 0,05% kể từ ngày hết thời hạn nộp thuế đến ngày thứ 90; 0,07% kể từ ngày chậm nộp thứ 91 trở đi. (quy định của Luật số 21/2012/QH13)", "Từ ngày 1/1/2015 - 30/6/2016: Tính theo tỷ lệ 0,05% (quy định của Luật số 71/2014/QH13)"]
    },
    {
        "description": "cách tính phạt chậm nộp",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [[" cách tính ", " như nào ", " thế nào ", " kiểu gì ", " hướng dẫn "]],
        "answer": ["Cách tính phạt chậm nộp: Số tiền phạt = Số tiền nợ x tỷ lệ x số ngày chậm nộp", "Bạn có thể nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016. Tôi sẽ tính số tiền phạt chậm nộp cho bạn"]
    },
    {
        "description": "cách nhập để tính phạt",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [" tính phạt "],
        "answer": ["Ví dụ bạn nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016. Tôi sẽ tính số tiền phạt chậm nộp cho bạn"]
    },
    {
        "description": "tính phạt chậm nộp",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [" tính phạt ", " từ ", " đến "],
        "answer": ["function:tinh_phat"]
    },



    {
        "description": "Khai thuế qua mạng là gì?",
        "catalogue": [[" khai thuế qua mạng ", " kê khai qua mạng ", " nộp tờ khai qua mạng ", " nộp tk qua mạng "]],
        "keyword": [" là gì "],
        "answer": ["Khai thuế qua mạng là việc người nộp thuế lập hồ sơ khai thuế trên máy vi tính của mình và gửi hồ sơ đến cơ quan thuế trực tiếp quản lý bằng mạng internet. Khai thuế qua mạng là dịch vụ Thuế điện tử được pháp luật về Thuế quy định"]
    },
    {
        "description": "Khai thuế qua mạng như thế nào",
        "catalogue": [[" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai "]],
        "keyword": [[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào ", " cách "]],
        "answer": ["Để khai thuế qua mạng bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang http://kekhaithue.gdt.gov.vn \n- Bạn có thể xem cách nộp tại đây https://youtu.be/IMeg6n6reI0"]
    },
    {
        "description": "Đăng ký khai thuế qua mạng như thế nào",
        "catalogue": [[" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai ", " kekhaithue ", " nhantokhai "]],
        "keyword": [" đăng ký ", [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Bạn xem cách đăng ký khai thuế qua mạng tại đây https://youtu.be/LWJKaoqtAYI"]
    },
    {
        "description": "gửi tk lỗi",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "]],
        "keyword":[[" không được ", " lỗi "]],
        "answer": ["Bạn hãy mô tả chi tiết lỗi gặp phải nhé. VD như: gửi tk báo lỗi xsd, gửi tk báo lỗi java.lang.null, gửi tk báo lỗi chưa đến thời kỳ làm bc, ..."]
    },
    {
        "description": "Không gửi được tk",
        "catalogue": [[" không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "]],
        "keyword":[[" không gửi được tk ", " không gửi được tờ khai "]],
        "answer": ["Bạn hãy mô tả chi tiết lỗi gặp phải nhé. VD như: gửi tk báo lỗi xsd, gửi tk báo lỗi java.lang.null, gửi tk báo lỗi chưa đến thời kỳ làm bc, ..."]
    },
    {
        "description": "gửi tk báo lỗi phiên bản tk không đúng",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", " phiên bản "],
        "answer": ["Bạn hãy tải HTKK phiên bản mới nhất về cài đặt, sau đó kết xuất tờ khai gửi lại", "Tải HTKK mới nhất tại đây http://adf.ly/1aAYdJ"]
    }, 
    {
        "description": "gửi tk báo lỗi xsd",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", " sai tại dòng ", " xsd "],
        "answer": ["Đây là lỗi cấu trúc của tờ khai. Bạn xem lại các bảng kê của tk", "Các mst trên bảng kê có đúng không: không có dấu cách, có dấu gạch ngang nếu là mst chi nhánh, ...", "TK GTGT theo quy định không cần gửi phụ lục 01-1, 01-2 nữa nên bạn xóa 2 PL này đi", "Nếu không rơi vào 2 trường hợp lỗi trên bạn liên lạc với bộ phận hỗ trợ của CQT để được trợ giúp"]
    },
    {
        "description": "gửi bảng kê word/excel báo lỗi package should contain a content type part",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "],
        "keyword": [[" word ", " excel "], " lỗi ", " package should contain a content type part "],
        "answer": ["Bạn vào Control Panel > Click vào Java > Chọn General > Chọn Settings... -> Delete Files... > Nhấn nút OK"]
    },
    {
        "description": "gửi tk báo lỗi hồ sơ chưa đăng ký nộp qua mạng",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", [" hồ sơ chưa đăng ký nộp qua mạng ", " hồ sơ chưa đăng ký qua mạng ", " hồ sơ chưa đăng ký "]],
        "answer": ["Do tờ khai chưa được đăng ký nộp. Bạn vào TÀI KHOẢN > ĐĂNG KÝ TỜ KHAI để đăng ký", "Bạn xem chi tiết tại đây http://lehoangdieu.blogspot.com/2016/02/ang-ky-to-khai-phai-nop-qua-mang.html"]
    },
    {
        "description": "cách gửi bảng kê, thuyết minh BCTC",
        "catalogue": [[" gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk ", " gửi thuyết minh ", " nộp thuyết minh "]],
        "keyword": [[" cách ", " thế nào ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Các bảng kê hoặc thuyết minh BCTC bạn gửi file định dạng word hoặc excel. Cách làm bạn xem tại đây http://lehoangdieu.blogspot.com/2016/02/nop-thuyet-minh-bctc-qua-mang.html"]
    },
    {
        "description": "gửi tk báo lỗi java.lang.null hoặc internal server error",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", [" java . lang ", " internal server "]],
        "answer": ["Nếu website hiển thị thông báo java.lang.null hoặc internal server error thì đây là lỗi của website. Bạn hãy đợi 1 lát nữa rồi vào làm lại"]
    },
    {
        "description": "vào kekhaithue báo lỗi we were unable to return you to...",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", " we were unable to return you to "],
        "answer": ["Trên trình duyệt bạn chọn TOOLS > COMPATIBILITY VIEW SETTINGS > Nhấn ADD"]
    },
    {
        "description": "vào nộp tk báo đang tải thư viện mà không hiện nút chọn tệp tờ khai",
        "catalogue": [" kekhaithue ", " nhantokhai ", " tải thư viện ", " chọn tệp tờ khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "],
        "keyword": [[" không có ", " không xuất hiện ", " không hiện ", " không nhìn thấy ", " không thấy "], " chọn tệp tờ khai "],
        "answer": ["Có lẽ bạn bị lỗi java hoặc chưa enable java trên trình duyệt IE. Java không hoạt động thì sẽ không xuất hiện nút CHỌN TỆP TỜ KHAI. Bạn hãy cài lại java phiên bản mới nhất trên trang java.com nhé"]
    },
    {
        "description": "Nộp tk bằng cái gì?",
        "catalogue": [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "],
        "keyword": [[" sử dụng ", " dùng "], [" trình duyệt ", " cái gì ", " bằng gì "]],
        "answer": ["Bạn có thể sử dụng trình duyệt Internet Explorer để gửi tk.\nVới Firefox, Chrome hoặc Cốc Cốc để GỬI TỜ KHAI qua trang kekhaithue.gdt.gov.vn bạn xem hướng dẫn này nhé http://adf.ly/10096599/ihtkktrenff"]
    },
    {
        "description": "Trang kekhaithue không vào được",
        "catalogue": [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nopthue ", " nộp thuế "],
        "keyword": [[" không vào được ", " không truy cập được ", " chạy chậm ", " chạy rất chậm "]],
        "answer": ["Đôi khi website kekhaithue.gdt.gov.vn hoặc nopthue.gdt.gov.vn bị quá tải nên có thể khó truy cập"]
    },
    {
        "description": "gửi tk báo lỗi chưa đến thời kỳ làm bc",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", [" chưa đến thời kỳ ", " chưa đến kỳ "], [" báo cáo ", " bc "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký lại thời gian bắt đầu nộp TK, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Đăng ký tờ khai phải nộp trên trang kekhaithue",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " kê khai "],
        "keyword": [" đăng ký ", [" đăng ký tờ khai ", " đăng ký tk ", " đăng ký thêm tờ khai ", " đăng ký thêm tk "], [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Ngừng tờ khai phải nộp trên trang kekhaithue",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " kê khai "],
        "keyword": [" đăng ký ", [" ngừng tk ", " ngừng tờ khai ", " bỏ tk ", " bỏ tk ", " hủy tk ", " hủy tờ khai "],[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký ngừng TK phải nộp, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Lập tờ khai, đăng ký, gửi và tra cứu kết quả cấp mã người phụ thuộc",
        "catalogue": [[" cấp mã người phụ thuộc ", " cấp mã npt ", " cấp mã số người phụ thuộc ", " cấp mã số npt ", " cấp mã số thuế người phụ thuộc ", " cấp mst npt ", " cấp người phụ thuộc ", " cấp npt "]],
        "keyword": [[" tờ khai ", " đăng ký ", " gửi ", " tra cứu "]],
        "answer": ["Bạn xem hướng dẫn lập tờ khai, đăng ký, gửi và tra cứu kết quả cấp mã người phụ thuộc qua mạng tại đây http://lehoangdieu.blogspot.com/2016/02/lap-to-khai-ang-ky-gui-va-tra-cuu-ket.html"]
    },
    {
        "description": "Lỗi không thể ký được tệp tờ khai",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "]],
        "keyword": [" lỗi ", [" không thể ký được tệp tờ khai ", " không thể ký được tệp tk ", " không ký được tệp tờ khai ", " không ký được tệp tk ", " không thể ký được tờ khai ", " không thể ký được tk ", " không ký được tờ khai ", " không ký được tk "]],
        "answer": ["Bạn xem cách khắc phục lỗi không thể ký được tệp tờ khai tại đây http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-khong-ky-uoc-tep-to-khai.html"]
    },
    {
        "description": "thông báo Chức năng chỉ hoạt động với tài khoản đăng ký khai và nộp thuế qua hệ thống Khai thuế qua mạng của Tổng cục Thuế",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "]],
        "keyword": [" lỗi ", " chức năng chỉ hoạt động với tài khoản "],
        "answer": ["Bạn xem cách khắc phục thông báo Chức năng chỉ hoạt động với tài khoản đăng ký khai và nộp thuế qua hệ thống Khai thuế qua mạng của TCT tại đây http://lehoangdieu.blogspot.com/2016/02/thong-bao-chuc-nang-chi-hoat-ong-voi.html"]
    },
    {
        "description": "thay đổi thông tin khai thuế",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " khai thuế "]],
        "keyword": [[" đổi ", " sửa "], " thông tin "],
        "answer": ["Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN để thay đổi những thông tin như số điện thoại, email, tên người liên hệ, số serial chứng thư số"]
    },








    {
        "description": "Các phần mềm cần cài để khai nộp thuế",
        "catalogue": [" kê khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai nộp thuế ", " khai thuế "],
        "keyword": [" phần mềm ", [" cần thiết ", " cài "]],
        "answer": ["Bạn cần cài những phần mềm sau để khai nộp thuế:\n- HTKK: lập tờ khai\n- iTaxViewer: xem TK\n- Java: đọc và ký TK, chứng từ,...\n- Phần mềm quản lý bút ký\n- Trình duyệt web"]
    },
    {
        "description": "quên mật khẩu khai nộp thuế",
        "catalogue": [" kê khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai nộp thuế ", " khai thuế ", " kekhaithue ", " nhantokhai ", " nopthue "],
        "keyword": [[" quên ", " mất ", " lấy lại ", " không nhớ "], [" mật khẩu ", " pass ", " password "]],
        "answer": ["Bạn xem cách lấy lại mật khẩu ở đây http://lehoangdieu.blogspot.com/2016/02/lay-lai-mat-khau-khai-thue-va-nop-thue.html"]
    },
    {
        "description": "Gửi tk hoặc nộp thuế báo lỗi chứng thư số chưa đăng ký với cqt",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai thuế ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " không nộp được thuế "],
        "keyword": [" lỗi ", [" chứng thư số chưa đăng ký ", " chứng thư số không đăng ký ", " chứng thư số đăng ký "]],
        "answer": ["Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN > Nhấn vào THAY ĐỔI SỐ SERIAL"]
    },
    {
        "description": "Gửi tk hoặc nộp thuế báo lỗi sai số PIN hoặc không tìm thấy chứng thư số",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai thuế ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " không nộp được thuế "],
        "keyword": [" lỗi ", [" sai số pin ", " không tìm thấy chứng thư "]],
        "answer": ["Bạn đã cài phần mềm quản lý chữ ký số chưa? Nếu cài rồi thì bạn vào phần mềm kiểm tra lại số PIN xem có đúng không hay chứng thư có bị khóa không"]
    },
    {
        "description": "báo sai số PIN",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai thuế ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " không nộp được thuế "],
        "keyword": [[" pin sai ", " sai pin ", " sai số pin "]],
        "answer": ["Bạn đăng nhập vào phần mềm quản lý bút ký để kiểm tra lại số PIN. Nếu không nhớ số PIN hãy liên lạc với công ty cung cấp chữ ký số"]
    },
    {
        "description": "Nộp thuế qua mạng là gì",
        "catalogue": [[" nộp thuế qua mạng ", " nộp thuế điện tử "]],
        "keyword": [" là gì "],
        "answer": ["Nộp thuế qua mạng là việc thực hiện các thủ tục nộp tiền vào Ngân sách nhà nước qua mạng máy tính mà không phải trực tiếp đến Ngân hàng hoặc Kho bạc. Nộp thuế qua mạng là dịch vụ Thuế điện tử được pháp luật về Thuế quy định"]
    },
    {
        "description": "Nộp thuế như thế nào",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Để nộp thuế điện tử bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang https://nopthue.gdt.gov.vn \n- Xem các video hướng dẫn nộp chi tiết tại đây http://bit.ly/videokhainopthue"]
    },
    {
        "description": "Dùng trình duyệt nào để nộp thuế",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [[" sử dụng ", " dùng "], " trình duyệt "],
        "answer": ["Bạn sử dụng trình duyệt Internet Explorer để nộp tiền thuế qua mạng. Với các trình duyệt Firefox, Chrome hoặc Cốc Cốc phải cài đặt thêm Fire IE như sau http://lehoangdieu.blogspot.com/2016/02/nop-thue-bang-trinh-duyet-firefox.html"]
    },
    {
        "description": "Đăng ký nộp thuế điện tử như thế nào",
        "catalogue": [" nộp thuế "],
        "keyword": [" đăng ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế tại đây https://youtu.be/kgsTeNWyjQs"]
    },
    {
        "description": "Đăng ký Nộp thuế điện tử với thông tin sai thì phải làm như thế nào",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [" đăng ký ", [" sai ", " nhầm "], " thông tin ", [" làm thế nào ", " làm như thế nào ", " như nào "]],
        "answer": [" - Nếu bạn đăng ký nhầm ngân hàng: liên lạc với NH để NH từ chối đăng ký", "- Nếu đăng ký nhầm thông tin như email, số điện thoại:\n+Nếu chưa có tài khoản: Bạn liên lạc với NH để sửa lại thông tin.\n+Nếu đã có tài khoản: Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN để sửa"]
    },
    {
        "description": "Những NNT nào được tham gia Nộp thuế điện tử?",
        "catalogue": [" nộp thuế "],
        "keyword": [" tham gia ", " được "],
        "answer": ["NNT đảm bảo đầy đủ những điều kiện sau có thể tham gia nộp thuế điện tử: \n - Là tổ chức, doanh nghiệp được cấp mã số thuế và đang hoạt động \n - Có chứng thư số\n - Có kết nối Internet và địa chỉ thư điện tử\n- Có tài khoản tại một trong những Ngân hàng thương mại triển khai nộp thuế với TCT"]
    },
    {
        "description": "NNT đang thực hiện kê khai thuế qua mạng tại các nhà TVAN có tham gia nộp thuế điện tử được không?",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [" khai thuế ", [" tvan ", " t-van "], [" có được ", " có tham gia ", " có thể "]],
        "answer": ["Có bạn nhé. NNT khai thuế qua mạng qua TVAN có thể tham gia nộp thuế điện tử tại nopthue.gdt.gov.vn của TCT"]
    },
    {
        "description": "Chữ ký số được sử dụng trong Nộp thuế điện tử cho thể là chữ ký số được sử dụng Khai thuế qua mạng hay không",
        "catalogue": [" nộp thuế "],
        "keyword": [[" chứng thư số ", " chữ ký số ", " token ", " bút ký "], [" sử dụng ", " dùng trong "], [" khai thuế ", " nộp tờ khai ", " nộp tk "], [" dùng để ", " dùng chung "]],
        "answer": ["Chữ ký số trong nộp thuế và Chữ ký số sử dụng trong khai thuế giống nhau, tuy nhiên vẫn có thể sử dụng hai chữ ký số khác nhau cho hai ứng dụng này, tùy bạn lựa chọn"]
    },
    {
        "description": "NNT được đăng ký sử dụng Nộp thuế điện tử tối đa với bao nhiêu Ngân hàng",
        "catalogue": [" nộp thuế "],
        "keyword": [" đăng ký ", " bao nhiêu ", [" ngân hàng ", " nh "]],
        "answer": ["Bạn có thể đăng ký với tất cả các  ngân hàng đã kết nối với hệ thống của Tổng cục Thuế.\nDanh sách các NH xem tại đây http://adf.ly/10096599/dangkyntdt"]
    },
    {
        "description": "Đăng ký sử dụng nộp thuế điện tử ở đâu?",
        "catalogue": [" nộp thuế "],
        "keyword": [" đăng ký ", [" tại đâu ", " ở đâu ", " ở trang nào ", " tại trang nào ", " cổng thông tin nào ", " cổng nào ", " chỗ nào "]],
        "answer": ["Bạn có thể đăng ký nộp thuế điện tử tại https://nopthue.gdt.gov.vn của TCT hoặc các trang web của các đơn vị TVAN"]
    },
    {
        "description": "Cách đăng ký nộp thuế",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [" đăng ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế qua mạng tại đây https://youtu.be/kgsTeNWyjQs"]
    },
    {
        "description": "Thay đổi thông tin nộp thuế",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [[" đổi thông tin ", " sửa thông tin ", " thay thông tin "], [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách thay đổi thông tin nộp thuế tại đây https://youtu.be/b8Pjbq3G1vQ"]
    },
    {
        "description": "Lỗi có giấy nộp tiền giống với giấy nộp tiền hiện tại trong 10 ngày gần đây",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [" lỗi ", [" có giấy nộp tiền giống với giấy nộp tiền hiện tại ", " bạn cần tách số tiền "]],
        "answer": ["Bạn xem cách sửa lỗi có giấy nộp tiền giống với giấy nộp tiền hiện tại trong 10 ngày gần đây tại http://lehoangdieu.blogspot.com/2016/02/canh-bao-co-giay-nop-tien-giong-voi.html"]
    },
    {
        "description": "lỗi giấy nộp tiền vượt quá số ký tự của ngân hàng. Đề nghị rút ngắn nội dung ghi chú hoặc tách thành hai giấy nộp tiền",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [" lỗi ", [" giấy nộp tiền vượt quá số ký tự của ngân hàng ", " gnt vượt quá số ký tự của ngân hàng ", " giấy nộp tiền vượt quá số ký tự của nh ", " gnt vượt quá số ký tự của nh ", " giấy nộp tiền vượt quá ký tự của ngân hàng ", " gnt vượt quá ký tự của ngân hàng ", " giấy nộp tiền vượt quá ký tự của nh ", " gnt vượt quá ký tự của nh "]],
        "answer": ["Bạn xem cách sửa lỗi lỗi giấy nộp tiền vượt quá số ký tự của ngân hàng tại http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-giay-nop-tien-vuot-qua-so.html"]
    },
    {
        "description": "Hỗ trợ về số tài khoản ngân hàng",
        "catalogue": [[" tài khoản ngân hàng", " tài khoản nh ", " tk ngân hàng ", " tk nh"]],
        "keyword": [[" tài khoản ngân hàng", " tài khoản nh ", " tk ngân hàng ", " tk nh"]],
        "answer": ["Số tài khoản ngân hàng là số tài khoản tại ngân hàng của bạn. Để thay đổi, thêm mới tài khoản này bạn hãy liên lạc với ngân hàng. Nếu muốn đăng ký nhiều số tài khoản 1 lúc thì khi đăng ký bạn nhập mỗi tài khoản cách nhau bởi dấu chấm phẩy (;)"]
    },
    {
        "description": "không ký được tờ khai/giấy nộp tiền",
        "catalogue": [" không ký được ", " không thể ký được ", " không ký điện tử được ", " không thể ký điện tử được "],
        "keyword": [" không ký được ", " không thể ký được ", " không ký điện tử được ", " không thể ký điện tử được "],
        "answer": ["Có lẽ bạn bị lỗi java nên không thể ký được. Bạn hãy gõ: \"cách cài đặt java\" hoặc \"cách nâng cấp java\" để được hướng dẫn cài đặt/nâng cấp"]
    },


    {
        "description": "Tra cứu giấy nộp tiền",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [[" tra cứu ", " tìm "], [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn vào TRA CỨU > TRA CỨU GIẤY NỘP TIỀN để tra cứu giấy nộp tiền đã gửi thành công hay chưa. Bạn xem chi tiết tại đây https://youtu.be/01lb6LcPFjs"]
    },
    {
        "description": "Trình ký giấy nộp tiền",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [" trình ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách trình ký giấy nộp tiền tại đây https://youtu.be/hK3UR0vv76w"]
    },
    {
        "description": "Lập giấy nộp tiền nộp thay",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [" nộp thay ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Chức năng lập giấy nộp tiền nộp thay dùng để nộp thay tiền thuế cho DN khác. Bạn xem cách lập giấy nộp tiền nộp thay tại đây https://youtu.be/l46eaayXsZM"]
    },
    {
        "description": "Lập giấy nộp tiền",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [[" tạo ", " lập ", " khai ", " làm "], [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách lập giấy nộp tiền tại đây https://youtu.be/ngmUka21pZI"]
    },




    {
        "description": "Tra cứu tờ khai",
        "catalogue": [[" tra cứu tờ khai ", " tra cứu tk ", " tìm tờ khai ", " tìm tk "]],
        "keyword": [[" tra cứu tờ khai ", " tra cứu tk ", " tìm tờ khai ", " tìm tk "]],
        "answer": ["Bạn vào TRA CỨU > TRA CỨU TỜ KHAI để tra cứu các tờ khai đã gửi cho cơ quan thuế. Bạn xem chi tiết tại đây https://youtu.be/crP8SxyLb3A"]
    },


    {
        "description": "Tra cứu thông báo nộp thuế",
        "catalogue": [[" thông báo nộp thuế ", " tb nộp thuế ", " xác nhận nộp thuế ", " thông báo nộp tiền ", " tb nộp tiền ", " xác nhận nộp tiền "]],
        "keyword": [[" thông báo nộp thuế ", " tb nộp thuế ", " xác nhận nộp thuế ", " thông báo nộp tiền ", " tb nộp tiền ", " xác nhận nộp tiền "]],
        "answer": ["Thông báo nộp thuế đã thành công hay chưa bạn có thể vào email hoặc vào TRA CỨU > TRA CỨU THÔNG BÁO để xem. Thông báo ở email và thông báo trên trang web có giá trị như nhau. Bạn xem chi tiết cách tra cứu tại đây https://youtu.be/T9LztT_iVMA"]
    },

    {
        "description": "Tra cứu thông báo nộp tk",
        "catalogue": [[" thông báo nộp tờ khai ", " tb nộp tờ khai ", " xác nhận nộp tờ khai ", " thông báo nộp tk ", " tb nộp tk ", " xác nhận nộp tk "]],
        "keyword": [[" thông báo nộp tờ khai ", " tb nộp tờ khai ", " xác nhận nộp tờ khai ", " thông báo nộp tk ", " tb nộp tk ", " xác nhận nộp tk "]],
        "answer": ["Thông báo nộp tờ khai đã thành công hay chưa bạn có thể vào email hoặc vào TRA CỨU > TRA CỨU THÔNG BÁO để xem. Thông báo ở email và thông báo trên trang web có giá trị như nhau. Bạn xem chi tiết cách tra cứu tại đây https://youtu.be/crP8SxyLb3A"]
    }

]

var a_tieumuc = [
    {"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1701", "tentieumuc": "Thuế giá trị gia tăng hàng sản xuất - kinh doanh trong nước "},
    {"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1704", "tentieumuc": "Thuế GTGT từ HĐ thăm dò,PT mỏ và KT dầu,khí TN(trừ H.định..) "},
    {"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1705", "tentieumuc": "Thuế giá trị gia tăng từ hoạt động xổ số kiến thiết "},
    {"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1749", "tentieumuc": "Thuế giá trị gia tăng khác "},

    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1051", "tentieumuc": "Thuế thu nhập DN của các đơn vị hạch toán toàn ngành "},
    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1052", "tentieumuc": "Thuế thu nhập DN của các đơn vị không hạch toán toàn ngành "},
    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1053", "tentieumuc": "Thuế TNDN từ chuyển nhượng bất động sản "},
    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1055", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển nhượng vốn "},
    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1056", "tentieumuc": "Thuế TNDN từ HĐ thăm dò,PT mỏ và KT dầu,khí TN(trừ H.định..) "},
    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1057", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động xổ số "},
    {"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1099", "tentieumuc": "Thuế thu nhập doanh nghiệp khác "},

    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1801", "tentieumuc": "Thuế môn bài bậc 1 "},
    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1802", "tentieumuc": "Thuế môn bài bậc 2 "},
    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1803", "tentieumuc": "Thuế môn bài bậc 3 "},
    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1804", "tentieumuc": "Thuế môn bài bậc 4 "},
    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1805", "tentieumuc": "Thuế môn bài bậc 5 "},
    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1806", "tentieumuc": "Thuế môn bài bậc 6 "},
    {"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1849", "tentieumuc": "Thuế môn bài khác "},

    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1001", "tentieumuc": "Thuế thu nhập từ tiền lương, tiền công "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1003", "tentieumuc": "Thuế thu nhập từ hoạt động sản xuất, kinh doanh của cá nhân "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1004", "tentieumuc": "Thuế thu nhập từ đầu tư vốn của cá nhân "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1005", "tentieumuc": "Thuế thu nhập từ chuyển nhượng vốn "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1006", "tentieumuc": "Thuế thu nhập từ chuyển nhượng BĐS, NTK và NQT là BĐS "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1007", "tentieumuc": "Thuế thu nhập từ trúng thưởng "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1008", "tentieumuc": "Thuế thu nhập từ bản quyền, nhượng quyền thương mại "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1012", "tentieumuc": "Thuế thu nhập từ thừa kế , quà biếu, quà tặng khác trừ BĐS "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1014", "tentieumuc": "Thuế thu nhập từ dịch vụ cho thuê nhà, cho thuê mặt bằng "},
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1049", "tentieumuc": "Thuế thu nhập khác "},

    {"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1101", "tentieumuc": "Thu nợ thuế chuyển thu nhập của các chủ đầu tư nước ngoài ở Việt nam về nước "},
    {"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1102", "tentieumuc": "Thu nợ thuế chuyển vốn của các chủ đầu tư trong các doanh nghiệp "},
    {"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1103", "tentieumuc": "Thu nợ thuế chuyển thu nhập của các chủ đầu tư Việt nam ở nước ngoài về nước "},

    {"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1151", "tentieumuc": "Thu nhập sau thuế thu nhập "},
    {"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1152", "tentieumuc": "Thu chênh lệch của doanh nghiệp công ích "},
    {"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1153", "tentieumuc": "Thu nhập sau thuế thu nhập từ hoạt động xổ số "},
    {"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1199", "tentieumuc": "Khác "},

    {"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1251", "tentieumuc": "Thu tiền cấp quyền khai thác khoáng sản "},

    {"muc": "1300", "tenmuc": "Thuế sử dụng đất nông nghiệp", "tieumuc": "1301", "tentieumuc": "Đất trồng cây hàng năm "},
    {"muc": "1300", "tenmuc": "Thuế sử dụng đất nông nghiệp", "tieumuc": "1302", "tentieumuc": "Đất trồng cây lâu năm "},
    {"muc": "1300", "tenmuc": "Thuế sử dụng đất nông nghiệp", "tieumuc": "1349", "tentieumuc": "Đất khác "},

    {"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất", "tieumuc": "1351", "tentieumuc": "Đất ở "},
    {"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất", "tieumuc": "1352", "tentieumuc": "Đất xây dựng "},
    {"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất", "tieumuc": "1353", "tentieumuc": "Đất nông nghiệp "},
    {"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất", "tieumuc": "1354", "tentieumuc": "Đất ngư nghiệp "},
    {"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất", "tieumuc": "1399", "tentieumuc": "Đất dùng cho mục đích khác "},

    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1401", "tentieumuc": "Đất ở "},
    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1402", "tentieumuc": "Đất xây dựng "},
    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1403", "tentieumuc": "Đất nông nghiệp "},
    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1404", "tentieumuc": "Đất ngư nghiệp "},
    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1405", "tentieumuc": "Đất xen kẹp "},
    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1406", "tentieumuc": "Đất dôi dư "},
    {"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1449", "tentieumuc": "Đất dùng cho mục đích khác "},

    {"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1501", "tentieumuc": "Thuế nhà "},
    {"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1502", "tentieumuc": "Thuế đất ở "},
    {"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1503", "tentieumuc": "Thuế đất ngư nghiệp "},
    {"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1549", "tentieumuc": "Thuế đất khác "},

    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1551", "tentieumuc": "Dầu khí "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1552", "tentieumuc": "Nước thủy điện "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1553", "tentieumuc": "Khoáng sản kim loại "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1554", "tentieumuc": "Khoảng sản quý hiếm (vàng, bạc, đá quý) "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1555", "tentieumuc": "Khoảng sản phi kim loại "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1556", "tentieumuc": "Thủy, hải sản "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1557", "tentieumuc": "Sản phẩm rừng tự nhiên "},
    {"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1599", "tentieumuc": "Tài nguyên khoáng sản khác "},

    {"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1601", "tentieumuc": "Thu từ đất ở tại nông thôn "},
    {"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1602", "tentieumuc": "Thu từ đất ở tại đô thị "},
    {"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1603", "tentieumuc": "Thu từ đất sản xuất, kinh doanh phi nông nghiệp "},
    {"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1649", "tentieumuc": "Thu từ đất phi nông nghiệp khác "},

    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1753", "tentieumuc": "Mặt hàng thuốc lá điếu, xì gà sản xuất trong nước "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1754", "tentieumuc": "Mặt hàng rượu sản xuất trong nước "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1755", "tentieumuc": "Mặt hàng ô tô dưới 24 chỗ ngồi sản xuất trong nước "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1756", "tentieumuc": "Mặt hàng xăngnap-ta chế phẩm để pha chế xăng trong nước "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1757", "tentieumuc": "Các dịch vụ, các hàng hóa khác sản xuất trong nước "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1758", "tentieumuc": "Mặt hàng bia sản xuất trong nước "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1761", "tentieumuc": "Thuế tiêu thụ đặc biệt từ hoạt động xổ số "},
    {"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1799", "tentieumuc": "Thuế tiêu thụ đặc biệt khác "},

    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2001", "tentieumuc": "Thu từ xăng sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2002", "tentieumuc": "Thu từ dầu Diezel sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2003", "tentieumuc": "Thu từ dầu hỏa sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2004", "tentieumuc": "Thu từ dầu mazut, dầu mỡ nhờn sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2005", "tentieumuc": "Thu từ than đá sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2006", "tentieumuc": "Thu từ d.dịch hydro, chloro, fluoro, carbon s.x trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2007", "tentieumuc": "Thu từ túi ni lông sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2008", "tentieumuc": "Thu từ thuốc diệt cỏ sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2009", "tentieumuc": "Thu từ nhiên liệu bay sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2019", "tentieumuc": "Thu từ các sản phẩm, hàng hóa khác sản xuất trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2035", "tentieumuc": "Thu từ dàu mazut, dàu mỡ nhờn n.khẩu để bán trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2041", "tentieumuc": "Thu từ xăng nhập khẩu để bán trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2042", "tentieumuc": "Thu từ nhiên liệu bay nhập khẩu để bán trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2043", "tentieumuc": "Thu từ dầu Diezel nhập khẩu để bán trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2044", "tentieumuc": "Thu từ dầu hỏa nhập khẩu để bán trong nước "},
    {"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2045", "tentieumuc": "Thu từ dàu mazut, dàu mỡ nhờn n.khẩu để bán trong nước "},

    {"muc": "2100", "tenmuc": "Phí xăng dầu", "tieumuc": "2101", "tentieumuc": "Phí xăng các loại "},
    {"muc": "2100", "tenmuc": "Phí xăng dầu", "tieumuc": "2102", "tentieumuc": "Phí dầu Diezel "},
    {"muc": "2100", "tenmuc": "Phí xăng dầu", "tieumuc": "2103", "tentieumuc": "Phí dầu hỏa "},
    {"muc": "2100", "tenmuc": "Phí xăng dầu", "tieumuc": "2104", "tentieumuc": "Phí dầu ma zút "},
    {"muc": "2100", "tenmuc": "Phí xăng dầu", "tieumuc": "2105", "tentieumuc": "Phí dầu mỡ nhờn "},

    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2151", "tentieumuc": "Phí kiểm dịch động vật, sản phẩm động vật và thực vật; "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2152", "tentieumuc": "Phí giám sát khử trùng vật thể thuộc diện kiểm dịch thực vật "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2153", "tentieumuc": "Phí kiểm soát giết mổ động vật; "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2154", "tentieumuc": "Phí kiểm nghiệm dư lượng thuốc bảo vệ thực vậtvà sp thực vật "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2155", "tentieumuc": "Phí kiểm nghiệm chất lượng thức ăn chăn nuôi; "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2156", "tentieumuc": "Phí kiểm tra vệ sinh thú y; "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2157", "tentieumuc": "Phí bảo vệ nguồn lợi thủy sản; "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2158", "tentieumuc": "Phí kiểm nghiệm thuốc thú y; "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2161", "tentieumuc": "Phí kiểm định, khảo nghiệm thuốc bảo vệ thực vật. "},
    {"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2162", "tentieumuc": "Phí bình tuyển công nhận cây mẹ, cây đầu dòng,vườn giống cây "},

    {"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực công nghiệp, xây dựng", "tieumuc": "2201", "tentieumuc": "Phí kiểm tra nhà nước về chất lượng hàng hóa "},
    {"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực công nghiệp, xây dựng", "tieumuc": "2202", "tentieumuc": "Phí thử nghiệm chất lượng sản phẩm, vật tư, nguyên vật liệu "},
    {"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực công nghiệp, xây dựng", "tieumuc": "2203", "tentieumuc": "Phí xây dựng "},
    {"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực công nghiệp, xây dựng", "tieumuc": "2204", "tentieumuc": "Phí đo đạc, lập bản đồ địa chính "},
    {"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực công nghiệp, xây dựng", "tieumuc": "2205", "tentieumuc": "Phí thẩm định cấp quyền sử dụng đất "},

    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2251", "tentieumuc": "Phí chứng nhận xuất xứ hàng hóa (C/O); "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2252", "tentieumuc": "Phí chợ; "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2253", "tentieumuc": "Phí thẩm định KD thương mại có ĐK thuộc các L.vực, các ngành "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2254", "tentieumuc": "Phí thẩm định hồ sơ mua bán tàu, thuyền, tàu bay "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2255", "tentieumuc": "Phí thẩm định DA đầu tư xây dựng (thẩm định và thiết kế...) "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2256", "tentieumuc": "Phí thẩm định đánh giá trữ lượng khoáng sản; "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2257", "tentieumuc": "Phí thẩm định; phân hạng cơ sở lưu trú du lịch; "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2258", "tentieumuc": "Phí đấu thầu, đấu giá và thẩm định kết quả đấu thầu "},
    {"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2261", "tentieumuc": "Phí giám định hàng hóa xuất nhập khẩu. "},

    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2301", "tentieumuc": "Phí sử dụng đường bộ; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2302", "tentieumuc": "Phí sử dụng đường thủy nội địa (phí bảo đảm hàng giang); "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2303", "tentieumuc": "Phí sử dụng đường biển; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2304", "tentieumuc": "Phí qua cầu; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2305", "tentieumuc": "Phí qua đò; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2306", "tentieumuc": "Phí qua phà; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2307", "tentieumuc": "Phí sử dụng cầu, bến, phao neo thuộc khu vực cảng biển "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2308", "tentieumuc": "Phí sử dụng cầu, bến, phao neo thuộc cảng, bến thủy nội địa; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2311", "tentieumuc": "Phí sử dụng cảng cá; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2312", "tentieumuc": "Phí sử dụng vị trí neo, đậu ngoài phạm vi cảng "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2313", "tentieumuc": "Phí bảo đảm hàng hải; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2314", "tentieumuc": "Phí hoa tiêu, dẫn đường trong lĩnh vực đường biển; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2315", "tentieumuc": "Phí hoa tiêu, dẫn đường trong lĩnh vực đường thủy nội địa; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2316", "tentieumuc": "Phí hoa tiêu, dẫn đường trong lĩnh vực hàng không; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2317", "tentieumuc": "Phí trọng tải tàu, thuyền; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2318", "tentieumuc": "Phí luồng, lạch đường thủy nội địa; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2321", "tentieumuc": "Phí sử dụng lề đường, bến, bãi, mặt nước; "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2322", "tentieumuc": "Phí kiểm định an toàn kỹ thuật và chất lượng thiết bị,vật tư "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2323", "tentieumuc": "Phí sử dụng kết cấu hạ tầng đường sắt quốc gia "},
    {"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2324", "tentieumuc": "Phí lưu giữ, bảo quản tang vật, phương tiện "},

    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2351", "tentieumuc": "Phí sử dụng tần số vô tuyến điện "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2352", "tentieumuc": "Phí cấp tên miền, địa chỉ Internet "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2353", "tentieumuc": "Phí sử dụng kho số viễn thông "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2354", "tentieumuc": "Phí khai thác và sử dụng tài liệu dầu khí "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2355", "tentieumuc": "Phí K.thác và sd tài liệu đất đai, thăm dò địa chất và KT mỏ "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2356", "tentieumuc": "Phí K.thác và SD tài liệu khí tượng thủy văn, MT nước và KK "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2357", "tentieumuc": "Phí K.thác, SD tư liệu tại thư viện, bảo tàng, khu di tích.. "},
    {"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin liên lạc", "tieumuc": "2358", "tentieumuc": "Phí thẩm định điều kiện hoạt động bưu chính, viễn thông "},

    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2401", "tentieumuc": "Phí K.định KT máy móc, TB, vật tư, các chất có Y/C về ATLĐ "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2402", "tentieumuc": "Phí K.định KT máy móc, TB có Y/C về AT đặc thù ngành CN "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2403", "tentieumuc": "Phí an ninh, trật tự; "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2404", "tentieumuc": "Phí phòng cháy, chữa cháy; "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2405", "tentieumuc": "Phí thẩm định cấp phép sử dụng vật liệu nổ công nghiệp; "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2406", "tentieumuc": "Phí k.tra, đánh giá, cấp giấy CN quốc tế về an ninh tàu biển "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2407", "tentieumuc": "Phí T.định, phê duyệt an ninh cảng biển, sổ lý lịch tàu biển "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2408", "tentieumuc": "Phí thẩm định cấp phép hoạt động cai nghiện ma túy; "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2411", "tentieumuc": "Phí T.định cấp phép HĐ hoá chất nguy hiểm,đánh giá rủi ro HC "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2412", "tentieumuc": "Phí xác minh giấy tờ, TL theo Y/C của tổ chức, CN trong nước "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2413", "tentieumuc": "Phí xác minh giấy tờ, TL theo Y/C của tổ chức, CN nước ngoài "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2414", "tentieumuc": "Phí xử lý hồ sơ cấp Giấy chứng nhận miễn thị thực. "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2415", "tentieumuc": "Phí thẩm định điều kiện về an ninh trật tự "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2416", "tentieumuc": "Phí sát hạch cấp chứng chỉ nghiệp vụ bảo vệ "},
    {"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, xã hội, an toàn xã hội", "tieumuc": "2417", "tentieumuc": "Phí trông giữ xe đạp, xe máy, ô tô và phí trông giữ phương tiện tham gia giao thông bị tạm giữ do vi phạm pháp luật "},

    {"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hóa, xã hội", "tieumuc": "2451", "tentieumuc": "Phí giám định di vật, cổ vật, bảo vật quốc gia; "},
    {"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hóa, xã hội", "tieumuc": "2452", "tentieumuc": "Phí tham quan danh lam thắng cảnh, di tích lịch sử, CT V.hóa "},
    {"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hóa, xã hội", "tieumuc": "2453", "tentieumuc": "Phí T.định N.dung văn hoá phẩm X.khẩu, N.khẩu,kịch bản phim. "},
    {"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hóa, xã hội", "tieumuc": "2454", "tentieumuc": "Phí giới thiệu việc làm. "},

    {"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực giáo dục và đào tạo", "tieumuc": "2501", "tentieumuc": "Học phí (không bao gồm học phí giáo dục không chính qui) "},
    {"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực giáo dục và đào tạo", "tieumuc": "2502", "tentieumuc": "Phí sát hạch đủ ĐK cấp văn bằng, chứng chỉ, G.phép hành nghề "},
    {"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực giáo dục và đào tạo", "tieumuc": "2503", "tentieumuc": "Phí dự thi, dự tuyển. "},

    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2551", "tentieumuc": "Viện phí và các loại phí khám chữa bệnh "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2552", "tentieumuc": "Phí phòng, chống dịch bệnh cho động vật; chẩn đoán thú y. "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2553", "tentieumuc": "Phí y tế dự phòng; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2554", "tentieumuc": "Phí giám định y khoa; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2555", "tentieumuc": "Phí kiểm nghiệm mẫu thuốc, N.liệu làm thuốc, thuốc, mỹ phẩm "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2556", "tentieumuc": "Phí kiểm dịch y tế; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2557", "tentieumuc": "Phí kiểm nghiệm trang thiết bị y tế; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2558", "tentieumuc": "Phí kiểm tra, kiểm nghiệm vệ sinh an toàn thực phẩm; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2561", "tentieumuc": "Phí thẩm định tiêu chuẩn và điều kiện hành nghề y; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2562", "tentieumuc": "Phí thẩm định đăng ký kinh doanh thuốc; "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2563", "tentieumuc": "Phí thẩm định hồ sơ nhập khẩu thuốc thành phẩm chưa có số ĐK "},
    {"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2564", "tentieumuc": "Phí cấp, đồi thẻ bảo hiểm y tế "},

    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2602", "tentieumuc": "Phí thẩm định báo cáo đánh giá tác động môi trường; "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2603", "tentieumuc": "Phí vệ sinh; "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2604", "tentieumuc": "Phí phòng, chống thiên tai; "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2605", "tentieumuc": "Phí xét nghiệm, thẩm định, giám định; tra cứu, cung cấp TT.. "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2606", "tentieumuc": "Phí lập và gửi đơn đăng ký quốc tế về sở hữu công nghiệp; "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2607", "tentieumuc": "Phí cung cấp DV để giải quyết khiếu nại sở hữu công nghiệp "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2608", "tentieumuc": "Phí T.định, CC thông tin về văn bằng bảo hộ giống cây trồng "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2611", "tentieumuc": "Phí cấp, hướng dẫn và duy trì sử dụng mã số, mã vạch "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2612", "tentieumuc": "Phí thẩm định an toàn và sử dụng dịch vụ an toàn bức xạ. "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2613", "tentieumuc": "Phí thẩm định ĐK hoạt động về khoa học công nghệ, môi trường "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2614", "tentieumuc": "Phí T.định đề án, báo cáo thăm dò, K.thác,đánh giá trữ lượng "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2615", "tentieumuc": "Phí thẩm định hồ sơ, điều kiện hành nghề khoan nước dưới đất; "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2616", "tentieumuc": "Phí thẩm định hợp đồng chuyển giao công nghệ; "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2617", "tentieumuc": "Phí kiểm định phương tiện đo lường. "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2618", "tentieumuc": "Phí bảo vệ môi trường đối với nước thải sinh hoạt "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2621", "tentieumuc": "Phí bảo vệ môi trường đối với nước thải công nghiệp "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2622", "tentieumuc": "Phí bảo vệ môi trường đối với khí thải "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2623", "tentieumuc": "Phí bảo vệ môi trường đối với chất thải rắn "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2624", "tentieumuc": "Phí BVMT đối với khai thác khoáng sản là dầu thô và khí TN "},
    {"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2625", "tentieumuc": "Phí bảo vệ môi trường đối với khai thác khoáng sản còn lại "},

    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2651", "tentieumuc": "Phí cung cấp thông tin về tài chính doanh nghiệp: "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2652", "tentieumuc": "Phí phát hành, thanh toán tín phiếu kho bạc; "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2653", "tentieumuc": "Phí phát hành, thanh toán trái phiếu kho bạc; "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2654", "tentieumuc": "Phí T/c phát hành, TT trái phiếu đ.tư cho công trình do NSNN "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2655", "tentieumuc": "Phí P.hành, TT trái phiếu để huy động vốn cho NH P.triển VN "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2656", "tentieumuc": "Phí bảo quản, cất giữ tài sản quý hiếm, chứng chỉ tại KBNN "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2657", "tentieumuc": "Phí cấp bảo lãnh của Chính phủ (do BTC hoặc NHNN VN cấp) "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2658", "tentieumuc": "Phí quản lý cho vay của Ngân hàng Phát triển Việt Nam; "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2661", "tentieumuc": "Phí sử dụng thiết bị, cơ sở hạ tầng chứng khoán; "},
    {"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2662", "tentieumuc": "Phí hoạt động chứng khoán; "},

    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2701", "tentieumuc": "Án phí (hình sự, dân sự, kinh tế, lao động, hành chính) "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2702", "tentieumuc": "Phí giám định tư pháp "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2703", "tentieumuc": "Phí cung cấp TT về cầm cố, T.chấp, B.lãnh T.sản ĐKGD bảo đảm "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2704", "tentieumuc": "Phí cung cấp thông tin về tài sản cho thuê tài chính "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2705", "tentieumuc": "Phí cấp bản sao, bản trích lục bản án, QĐ và giấy CN xoá án "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2706", "tentieumuc": "Phí thi hành án "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2707", "tentieumuc": "Phí tống đạt, UT tư pháp theo Y/C của CQ có thẩm quyền củaNN "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2708", "tentieumuc": "Phí xuất khẩu lao động "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2711", "tentieumuc": "Phí phá sản "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2712", "tentieumuc": "Phí T.định HS ĐN hưởng miễn trừ T.thuận H.chế C.tranh bị cấm "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2713", "tentieumuc": "Phí giải quyết việc nuôi con nuôi đối với người nước ngoài "},
    {"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2714", "tentieumuc": "Phí xử lý vụ việc cạnh tranh "},

    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2751", "tentieumuc": "Lệ phí quốc tịch, hộ tịch, hộ khẩu, chứng minh nhân dân "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2752", "tentieumuc": "Lệ phí cấp hộ chiếu, thị thực xuất cảnh, nhập cảnh "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2753", "tentieumuc": "Lệ phí qua lại cửa khẩu biên giới "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2754", "tentieumuc": "Lệ phí AD tại CQ đại diện ngoại giao, cơ quan lãnh sự ở NN "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2755", "tentieumuc": "Lệ phí nộp đơn YC Toà án VN C.nhận,thi hành tại VN bản án NN "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2756", "tentieumuc": "LP nộp đơn YC TA VN không CN bản án, Q.Định dân sự của TA NN "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2757", "tentieumuc": "LP nộp đơn YC T.án VN CN và cho thi hành tại VN QĐ của TT NN "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2758", "tentieumuc": "LP nộp đơn YC T.án K.luận cuộc đình công hợp pháp hoặc bấtHP "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2761", "tentieumuc": "Lệ phí kháng cáo "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2762", "tentieumuc": "Lệ phí tòa án liên quan đến trọng tài "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2763", "tentieumuc": "Lệ phí cấp giấy phép lao động cho người NN làm việc tại VN "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2764", "tentieumuc": "Lệ phí cấp phiếu lý lịch tư pháp "},
    {"muc": "2750", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền và N.vụ của công dân", "tieumuc": "2765", "tentieumuc": "Lệ phí cấp thẻ đi lại của doanh nhân APEC "},

    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2805", "tentieumuc": "Lệ phí địa chính; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2806", "tentieumuc": "Lệ phí đăng ký giao dịch bảo đảm; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2807", "tentieumuc": "Lệ phí cấp giấy chứng nhận quyền tác giả; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2808", "tentieumuc": "LP nộp đơn và cấp văn bằng bảo hộ, ĐK chuyển giao quyền SHCN "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2811", "tentieumuc": "LP duy trì, gia hạn, chấm dứt, k.phục H.lực văn bằng bảo hộ "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2812", "tentieumuc": "Lệ phí đăng bạ, công bố thông tin sở hữu công nghiệp; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2813", "tentieumuc": "Lệ phí cấp chứng chỉ hành nghề, đăng bạ đại diện sở hữu CN "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2814", "tentieumuc": "LP ĐK, cấp, C.bố,duy trì văn bằng bảo hộ giống cây trồng mới "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2815", "tentieumuc": "Lệ phí cấp giấy phép xây dựng; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2816", "tentieumuc": "LP Đ.ký, cấp biển PT giao thông (không kể PTGT đường thuỷ) "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2817", "tentieumuc": "Lệ phí đăng ký, cấp biển phương tiện giao thông đường thuỷ "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2818", "tentieumuc": "Lệ phí đăng ký, cấp biển xe máy chuyên dùng; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2821", "tentieumuc": "Lệ phí cấp chứng chỉ cho tàu bay; "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2822", "tentieumuc": "Lệ phí cấp biển số nhà, "},
    {"muc": "2800", "tenmuc": "Lệ phí QL nhà nước liên quan đến quyền sh, quyền SD tài sản", "tieumuc": "2823", "tentieumuc": "LP cấp giấy CN quyền sở hữu nhà ở, quyền SH công trình XD "},

    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2851", "tentieumuc": "LP cấp giấy CN ĐKKD, cung cấp TT đ.với các L.hình KT, hộ KD "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2852", "tentieumuc": "LP ĐK khai báo hoá chất nguy hiểm, hoá chất độc hại, máy, TB "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2853", "tentieumuc": "LP cấp chứng nhận,chứng chỉ,cấp phép,cấp giấy phép,cấp thẻ,đăng ký,kiểm tra đối với các hoạt động,các ngành nghề KD theo quy định của pháp luật "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2854", "tentieumuc": "LP đặt chi nhánh, vp đại diện của các t/c kinh tế NN tại VN "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2855", "tentieumuc": "Lệ phí cấp hạn ngạch xuất khẩu, nhập khẩu "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2856", "tentieumuc": "Lệ phí cấp và dán tem kiểm soát băng, đĩa có chương trình "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2857", "tentieumuc": "Lệ phí độc quyền hoạt động trong ngành dầu khí "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2858", "tentieumuc": "LP độc quyền HĐ trong một số ngành, nghề TNguyên khoáng sản "},
    {"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2859", "tentieumuc": "Lệ phí cấp giấy phép sử dụng tần số vô tuyến điện "},

    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3001", "tentieumuc": "Lệ phí ra, vào cảng biển; "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3002", "tentieumuc": "Lệ phí ra, vào cảng, bến thủy nội địa; "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3003", "tentieumuc": "Lệ phí ra, vào cảng hàng không, sân bay, "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3004", "tentieumuc": "Lệ phí cấp phép bay; "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3005", "tentieumuc": "Lệ phí hàng hóa, hành lý, phương tiện vận tải quá cảnh; "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3006", "tentieumuc": "LP cấp phép HĐ ksát, Tkế, lắp đặt, sc, bảo dưỡng các c.trình "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3007", "tentieumuc": "Lệ phí hoa hồng chữ ký; "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3008", "tentieumuc": "Lệ phí hoa hồng sản xuất. "},
    {"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặt biệt về chủ quyền quốc gia", "tieumuc": "3009", "tentieumuc": "Lệ phí cấp giấy phép cho hoạt động tàu, thuyền nước ngoài "},

    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3051", "tentieumuc": "Lệ phí cấp phép sử dụng con dấu; "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3054", "tentieumuc": "Lệ phí cấp giấy đăng ký nguồn phóng xạ, máy phát bức xạ "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3055", "tentieumuc": "Lệ phí cấp giấy đăng ký địa điểm cất giữ chất thải phóng xạ; "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3056", "tentieumuc": "Lệ phí cấp văn bằng, chứng chỉ; "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3057", "tentieumuc": "LP chứng thực theo yêu cầu hoặc theo quy định của pháp luật "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3058", "tentieumuc": "Lệ phí hợp pháp hóa và chứng nhận lãnh sự; "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3061", "tentieumuc": "Lệ phí công chứng; "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3062", "tentieumuc": "Lệ phí cấp GP quản lý vũ khí, vật liệu nổ, công cụ hỗ trợ "},
    {"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3063", "tentieumuc": "Lệ phí cấp giấy phép quy hoạch "},

    {"muc": "3200", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước", "tieumuc": "3201", "tentieumuc": "Lương thực "},
    {"muc": "3200", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước", "tieumuc": "3202", "tentieumuc": "Nhiên liệu "},
    {"muc": "3200", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước", "tieumuc": "3203", "tentieumuc": "Vật tư kỹ thuật "},
    {"muc": "3200", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước", "tieumuc": "3204", "tentieumuc": "Trang thiết bị kỹ thuật "},
    {"muc": "3200", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước", "tieumuc": "3249", "tentieumuc": "Khác "},

    {"muc": "3250", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3251", "tentieumuc": "Lương thực "},
    {"muc": "3250", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3252", "tentieumuc": "Nhiên liệu "},
    {"muc": "3250", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3253", "tentieumuc": "Vật tư kỹ thuật "},
    {"muc": "3250", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3254", "tentieumuc": "Trang thiết bị kỹ thuật "},
    {"muc": "3250", "tenmuc": "Thu tiền bán hàng hóa, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3299", "tentieumuc": "Khác "},

    {"muc": "3300", "tenmuc": "Thu tiền bán nhà thuộc sở hữu của nhà nước", "tieumuc": "3301", "tentieumuc": "Tiền bán nhà thuộc SHNN "},
    {"muc": "3300", "tenmuc": "Thu tiền bán nhà thuộc sở hữu của nhà nước", "tieumuc": "3302", "tentieumuc": "Thu tiền thanh lý nhà làm việc "},
    {"muc": "3300", "tenmuc": "Thu tiền bán nhà thuộc sở hữu của nhà nước", "tieumuc": "3349", "tentieumuc": "Khác "},

    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3351", "tentieumuc": "Mô tô "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3352", "tentieumuc": "Ô tô con, ô tô tải "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3353", "tentieumuc": "Xe chuyên dùng "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3354", "tentieumuc": "Tàu, thuyền "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3355", "tentieumuc": "Đồ gỗ "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3356", "tentieumuc": "Trang thiết bị kỹ thuật chuyên dụng "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3357", "tentieumuc": "Máy tính, photo, máy fax "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3358", "tentieumuc": "Điều hòa nhiệt độ "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3361", "tentieumuc": "Thiết bị phòng, chữa cháy "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3362", "tentieumuc": "Thu bán cây đứng "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3363", "tentieumuc": "Thu tiền bán tài sản, vật tư thu hồi thuộc kết cấu hạ tầng đường sắt "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3364", "tentieumuc": "Thu từ bồi thường tài sản "},
    {"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3399", "tentieumuc": "Các tài sản khác "},

    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3401", "tentieumuc": "Quyền khai thác khoáng sản, tài nguyên "},
    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3402", "tentieumuc": "Quyền đánh bắt hải sản "},
    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3403", "tentieumuc": "Quyền hàng hải "},
    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3404", "tentieumuc": "Quyền hàng không "},
    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3405", "tentieumuc": "Bằng phát minh, sáng chế "},
    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3406", "tentieumuc": "Bản quyền, nhãn hiệu thương mại "},
    {"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3449", "tentieumuc": "Khác "},

    {"muc": "3450", "tenmuc": "thu từ bán tài sản được xác lập sử hữu nhà nước", "tieumuc": "3451", "tentieumuc": "Tài sản vô thừ nhận "},
    {"muc": "3450", "tenmuc": "thu từ bán tài sản được xác lập sử hữu nhà nước", "tieumuc": "3452", "tentieumuc": "Di sản, khảo cổ tìm thấy trong lòng đất "},
    {"muc": "3450", "tenmuc": "thu từ bán tài sản được xác lập sử hữu nhà nước", "tieumuc": "3453", "tentieumuc": "Tài sản không được quyền thừa kế "},
    {"muc": "3450", "tenmuc": "thu từ bán tài sản được xác lập sử hữu nhà nước", "tieumuc": "3499", "tentieumuc": "Khác "},

    {"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3601", "tentieumuc": "Thu tiền thuê mặt đất "},
    {"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3602", "tentieumuc": "Thu tiền thuê mặt nước "},
    {"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3603", "tentieumuc": "Thu tiền thuê mặt đất, mặt nước từ các HĐ thăm dò,KT dầu khí "},
    {"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3604", "tentieumuc": "Thu tiền cho thuê mặt đất,mặt nước trong khu CN,khu chế xuất "},
    {"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3649", "tentieumuc": "Thu tiền cho thuê mặt đất, mặt nước, mặt biển khác "},

    {"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho DN và các tổ chức kinh tế", "tieumuc": "3651", "tentieumuc": "Thu nợ tiền sử dụng vốn ngân sách nhà nước "},
    {"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho DN và các tổ chức kinh tế", "tieumuc": "3652", "tentieumuc": "Thu KHCB nhà ở thuộc SHNN "},
    {"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho DN và các tổ chức kinh tế", "tieumuc": "3653", "tentieumuc": "Thu nợ tiền thu hồi vốn của DNNN và các tổ chức kinh tế nhà nước "},
    {"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho DN và các tổ chức kinh tế", "tieumuc": "3654", "tentieumuc": "Thu thanh lý TSCĐ của các DN Nhà nước và các t/c kt nhà nước "},
    {"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho DN và các tổ chức kinh tế", "tieumuc": "3699", "tentieumuc": "Thu khác từ tài sản NN giao cho DN và các tổ chức kinh tế "},

    {"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và phụ thu", "tieumuc": "3702", "tentieumuc": "Phụ thu vệ giá lắp đặt điện thoại "},
    {"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và phụ thu", "tieumuc": "3703", "tentieumuc": "Phụ thu về giá bán điện "},
    {"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và phụ thu", "tieumuc": "3704", "tentieumuc": "Phụ thu về giá bán nước "},
    {"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và phụ thu", "tieumuc": "3705", "tentieumuc": "Phụ thu về giá bán mặt hàng nhựa PVC "},
    {"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và phụ thu", "tieumuc": "3749", "tentieumuc": "Khác "},

    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3706", "tentieumuc": "Phụ thu về dầu, khí "},
    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3751", "tentieumuc": "Thuế tài nguyên "},
    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3752", "tentieumuc": "Thuế thu nhập doanh nghiệp về dầu thô "},
    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3753", "tentieumuc": "Lợi nhuận sau thuế được chia của Chính phủ Việt Nam "},
    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3754", "tentieumuc": "Dầu lãi được chia của Chính phủ Việt Nam "},
    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3755", "tentieumuc": "Thuế đặc biệt "},
    {"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3799", "tentieumuc": "Thu về dầu thô khác "},

    {"muc": "3800", "tenmuc": "Thu tiền khí thiên nhiên của C.phủ theo hiệp định, KT dầu khí", "tieumuc": "3801", "tentieumuc": "Thuế tài nguyên "},
    {"muc": "3800", "tenmuc": "Thu tiền khí thiên nhiên của C.phủ theo hiệp định, KT dầu khí", "tieumuc": "3802", "tentieumuc": "Thuế thu nhập doanh nghiệp "},
    {"muc": "3800", "tenmuc": "Thu tiền khí thiên nhiên của C.phủ theo hiệp định, KT dầu khí", "tieumuc": "3803", "tentieumuc": "Khi lãi được chia của Chính phủ Việt Nam "},
    {"muc": "3800", "tenmuc": "Thu tiền khí thiên nhiên của C.phủ theo hiệp định, KT dầu khí", "tieumuc": "3849", "tentieumuc": "Thu về khí thiên nhiên khác "},

    {"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3851", "tentieumuc": "Tiền thuê nhà thuộc SHNN "},
    {"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3852", "tentieumuc": "Thu tiền cho thuê quầy bán hàng "},
    {"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3853", "tentieumuc": "Tiền thuê cơ sở hạ tầng đường sắt "},
    {"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3854", "tentieumuc": "Tiền cho thuê và tiền chậm nộp tiền thuê cơ sở hạ tầng bến cảng, cầu cảng "},
    {"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3899", "tentieumuc": "Khác "},

    {"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3901", "tentieumuc": "Thu hoa lợi công sản từ quỹ đất công ích "},
    {"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3902", "tentieumuc": "Thu hoa lợi công sản từ quỹ đất công "},
    {"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3903", "tentieumuc": "Thu hỗ trợ khi nhà nước thu hồi đất theo chế độ quy định "},
    {"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3949", "tentieumuc": "Thu khác "},

    {"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3951", "tentieumuc": "Thuế tài nguyên "},
    {"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3952", "tentieumuc": "Thuế thu nhập doanh nghiệp về condensate "},
    {"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3953", "tentieumuc": "Lãi được chia của Chính phủ Việt Nam "},
    {"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3999", "tentieumuc": "Thu về condensate khác "},

    {"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư của C.Phủ ở trong nước", "tieumuc": "4051", "tentieumuc": "Lãi cho vay bằng nguồn vốn trong nước "},
    {"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư của C.Phủ ở trong nước", "tieumuc": "4052", "tentieumuc": "Lãi cho vay bằng nguồn vốn ngoài nước "},
    {"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư của C.Phủ ở trong nước", "tieumuc": "4053", "tentieumuc": "Chênh lệch thu, chi của Ngân hàng Nhà nước "},
    {"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư của C.Phủ ở trong nước", "tieumuc": "4054", "tentieumuc": "Thu nhập từ vốn góp của Nhà nước "},
    {"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư của C.Phủ ở trong nước", "tieumuc": "4099", "tentieumuc": "Khác "},

    {"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và góp vốn của Nhà nước ở NN", "tieumuc": "4101", "tentieumuc": "Lãi thu được từ các khoản cho các Chính phủ nước ngoài vay "},
    {"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và góp vốn của Nhà nước ở NN", "tieumuc": "4102", "tentieumuc": "Lãi thu được từ các khoản cho các tổ chức quốc tế vay "},
    {"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và góp vốn của Nhà nước ở NN", "tieumuc": "4103", "tentieumuc": "Lãi thu được từ các khoản cho các tổ chức tài chính và phi tài chính vay "},
    {"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và góp vốn của Nhà nước ở NN", "tieumuc": "4104", "tentieumuc": "Lãi thu từ các khoản tham gia góp vốn của Nhà nước "},
    {"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và góp vốn của Nhà nước ở NN", "tieumuc": "4149", "tentieumuc": "Khác "},

    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4251", "tentieumuc": "Phạt vi phạm hành chính theo quyết định của tòa án "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4252", "tentieumuc": "Trong đó: Phạt vi phạm an toàn giao thông "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4254", "tentieumuc": "Phạt VPHC trong LVT do ngành Thuế TH, ko gồm VPHC đv LTTNCN "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4255", "tentieumuc": "Phạt về vi phạm chế độ kế toán - thống kê "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4256", "tentieumuc": "Phạt vi phạm tệ nạn xã hội "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4257", "tentieumuc": "Phạt vi phạm bảo vệ nguồn lợi thủy sản "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4258", "tentieumuc": "Phạt vi phạm về trồng và bảo vệ rừng "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4261", "tentieumuc": "Phạt vi phạm hành chính về bảo vệ môi trường "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4262", "tentieumuc": "Phạt vi phạm hành chính trong lĩnh vực y tế, văn hóa "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4263", "tentieumuc": "Phạt vi phạm hành chính về trật tự, an ninh, quốc phòng "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4264", "tentieumuc": "Phạt kinh doanh trái pháp luật do ngành thuế thực hiện "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4266", "tentieumuc": "Phạt kinh doanh trái pháp luật do ngành thuế thực hiện "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4267", "tentieumuc": "Phạt vi phạm trật tự đô thị "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4268", "tentieumuc": "Phạt vi phạm hành chính đối với Luật Thuế thu nhập cá nhân "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4271", "tentieumuc": "Phạt tiền do phạm tội theo quyết định của tòa án "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4272", "tentieumuc": "Tiền chậm nộp phạt vi phạm hành chính do cơ quan thuế quản lý "},
    {"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4299", "tentieumuc": "Phạt vi phạm khác "},

    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4301", "tentieumuc": "Tịch thu từ công tác chống lậu do ngành thuế thực hiện "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4302", "tentieumuc": "Tịch thu khác do ngành thuế thực hiện "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4305", "tentieumuc": "Tịch thu từ công tác chống lậu của cơ quan quản lý thị trường thực hiện "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4306", "tentieumuc": "Tịch thu do vi phạm hành chính theo quyết định của tòa án, cơ quan thi hành án "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4307", "tentieumuc": "Tịch thu từ công tác chống lậu do các ngành khác thực hiện "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4308", "tentieumuc": "Tịch thu từ công tác chống lậu do ngành kiểm lâm thực hiện "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4311", "tentieumuc": "Tịch thu do phạm tội hoặc do liên quan tội phạm theo quyết định của tòa án, cơ quan thi hành án "},
    {"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4349", "tentieumuc": "Tịch thu khác "},

    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4901", "tentieumuc": "Thu chênh lệch tỷ giá ngoại tệ của NS "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4902", "tentieumuc": "Thu hồi các khoản chi năm trước "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4904", "tentieumuc": "Các khoản thu khác của ngành Thuế "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4906", "tentieumuc": "Tiền lãi thu từ các khoản vay nợ, viện trợ của các dự án "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4907", "tentieumuc": "Thu chênh lệch giá trái phiếu "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4908", "tentieumuc": "Thu điều tiết từ sàn phẩm lọc hóa dầu "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4911", "tentieumuc": "Tiền chậm nộp do ngành Thuế quản lý "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4913", "tentieumuc": "Thu từ các quỹ của doanh nghiệp xổ số kiến thiết theo quy định "},
    {"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4949", "tentieumuc": "Các khoản thu khác "}

]

var a_sorry = 'Rất tiếc vì tôi chưa có dữ liệu bạn cần. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé. Bạn có thể gõ "Trợ giúp" để xem hướng dẫn'
var url_htkk = 'http://www.gdt.gov.vn/wps/portal/home/hotrokekhai'
var item_show = 5 //số câu hỏi trợ giúp sẽ hiển thị nếu ko tìm thấy câu trả lời ng dùng đưa vào

function check(str, obj){ //tim duoc bao nhieu tu khoa trong obj
    var kq = 0
    var obj_len = obj.length
    for (var i = 0; i < obj_len; i++) {
        if (typeof(obj[i]) == "object") {
            kq = kq + check(str, obj[i])
        } else {
            if (str.indexOf(obj[i]) != -1) {
                kq += 1
            }
        }
    }
    return kq
}
function help(a, value){
    var str_result = []
    str_result.push("Tôi có thể trợ giúp những vẫn đề liên quan đến khai nộp thuế, như:")
    for (var i = a.length-1; i >= a.length-Number(value); i--){
        str_result.push(a[i]["description"])
    }
    str_result.push("Trường hợp dùng ứng dụng bị lỗi bạn hãy ghi rõ lỗi từ ứng dụng nào, ví dụ: Gửi tk báo lỗi không thể ký được tệp tờ khai, gửi tk báo lỗi java.lang.null, khi nộp thuế bị lỗi có giấy nộp tiền giống với giấy nộp tiền hiện tại trong 10 ngày gần đây, khi nộp thuế báo lỗi lỗi giấy nộp tiền vượt quá số ký tự của ngân hàng, ...")
    str_result.push("Bạn có thể xem video hướng dẫn tại https://www.youtube.com/playlist?list=PL9JVxqAVc8XMGC2wpPCXCuvKTT3Bc99G4")
    return str_result
}
function good_str(str) {
    //good_str("a.b") => a . b
    //good_str("a,b") => a , b
    //good_str("a?b") => a ? b
    //good_str("a!b") => a ! b
    //good_str("a;b") => a ; b
    //good_str("a.  b") => a .  b
    return (((((str.replace(/\s{2,}/g," ")).replace(/\./g, " . ")).replace(/,/g, " , ")).replace(/\;/g, " ; ")).replace(/\?/g, " ? ")).replace(/\!/g, " ! ")
}
function number_format(str){ //number_format(1000) => 1.000
    str = str.toString()
    if (str.trim() === "") return ""
    var str_to_array = str.split("")
    var array_len = str_to_array.length
    var kq = ""
    var j = 1
    for (var i = array_len-1; i>=0; i--){
        var add_dot = (j%3 === 0 && i !== 0)?".":""
        kq = kq + str_to_array[i] + add_dot
        j++
    }

    str_to_array = kq.split("")
    kq = ""
    array_len = str_to_array.length
    for (var i = array_len-1; i>=0; i--){
        kq = kq + str_to_array[i]
    }

    return kq
}
function search_tmuc(str, obj){
    var tieumuc_len = obj.length
    var str_done = " "+((((((((str.replace("tiểu mục"," ")).replace("là gì", " ")).replace("là cái gì", " ")).replace("là bao nhiêu"," ")).replace("gtgt", "giá trị gia tăng")).replace("tndn", "thu nhập doanh nghiệp")).replace("tncn", "thu nhập cá nhân")).replace("tra cứu", " ")).trim()+" "
    var kq = []
    var flag = 0
    
    for (var i = 0; i < tieumuc_len; i++){
        if (str_done.indexOf(obj[i]["tieumuc"]) != -1) {
            kq.push(i)
            flag = 1
            break           
        }
    }
    if (flag === 0) {
        for (var i = 0; i < tieumuc_len; i++){
            if (str_done.indexOf(obj[i]["muc"]) != -1) {
                kq.push(i)          
                flag = 2
            }
        }
    }
    if (flag === 0) {
        for (var i = 0; i < tieumuc_len; i++){
            if ((" "+(obj[i]["tenmuc"]).toLowerCase()+" ").indexOf(str_done) != -1) {
                kq.push(i)
                flag = 3           
            }
        }
    }
    if (flag === 0) {
        for (var i = 0; i < tieumuc_len; i++){
            if ((" "+(obj[i]["tentieumuc"]).toLowerCase()+" ").indexOf(str_done) != -1) {
                kq.push(i)          
                flag = 4
            }
        }
    }

    return kq
}
function milliseconds2date(num){
    var x = new Date(num)
    return x.getDate() + "/" + (x.getMonth()+1) + "/" + x.getFullYear()
}
function tinh_phat(str){
    //str = tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 31/12/2016
    var day_field
    var month_field
    var year_field

    var tu_ngay
    var tu_ngay_tmp
    var den_ngay
    var den_ngay_tmp
    var so_tien

    var kq = []
    var patt1 = /(từ ngày|từ) \d{1,2}\/\d{1,2}\/\d{4}/
    var patt1_1 = /(từ ngày|từ) \d{1,2}-\d{1,2}-\d{4}/
    if (patt1.test(str)){
        kq.push(str.match(patt1)[0])
        tu_ngay_tmp = str.match(patt1)[0].replace(/(từ ngày|từ) /, "")
    } else if (patt1_1.test(str)){
        kq.push(str.match(patt1_1)[0])
        tu_ngay_tmp = (str.match(patt1_1)[0].replace(/(từ ngày|từ) /, "")).replace(/-+/g, "/")
        
    } else return ["Bạn chưa có ngày bắt đầu tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    
    day_field = tu_ngay_tmp.split("/")[0]
    month_field = tu_ngay_tmp.split("/")[1]
    year_field = tu_ngay_tmp.split("/")[2]
    tu_ngay = new Date(year_field, Number(month_field)-1, day_field)
    if (tu_ngay.getMonth()+1 != Number(month_field) || tu_ngay.getDate() != day_field || tu_ngay.getFullYear() != year_field) return ["Bạn xác định sai ngày bắt đầu tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    //tu_ngay co gia tri hop le
    
    var patt2 = /(đến ngày|đến) \d{1,2}\/\d{1,2}\/\d{4}/
    var patt2_1 = /(đến ngày|đến) \d{1,2}-\d{1,2}-\d{4}/
    if (patt2.test(str)){
        kq.push(str.match(patt2)[0])
        den_ngay_tmp = str.match(patt2)[0].replace(/(đến ngày|đến) /, "")
    } else if (patt2_1.test(str)){
        kq.push(str.match(patt2_1)[0])
        den_ngay_tmp = (str.match(patt2_1)[0].replace(/(đến ngày|đến) /, "")).replace(/-+/g, "/")
        
    } else return ["Bạn chưa có ngày kết thúc tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    
    day_field = den_ngay_tmp.split("/")[0]
    month_field = den_ngay_tmp.split("/")[1]
    year_field = den_ngay_tmp.split("/")[2]
    den_ngay = new Date(year_field, Number(month_field)-1, day_field)
    if (den_ngay.getMonth()+1 != Number(month_field) || den_ngay.getDate()!=day_field || den_ngay.getFullYear()!=year_field) return ["Bạn xác định sai ngày kết thúc tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    //den_ngay co gia tri hop le

    var str_tmp = (str.replace(kq[0]," ")).replace(kq[1]," ")  //remove: tu ngay dd/mm/yyyy & den ngay dd/mm/yyyy
    
    var patt = /(\d+(\.|,)*)+ /
    if (patt.test(str_tmp)){
        var patt_daucham = /\./
        var patt_dauphay = /,/
        if (patt_daucham.test(str_tmp) === true && patt_dauphay.test(str_tmp) === true) return ["Bạn nhập sai số tiền tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
        kq.push(str_tmp.match(patt)[0])
        so_tien = (str_tmp.match(patt)[0].replace(/\.|,/g,"")).trim()
    } else return ["Bạn phải nhập số tiền tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    //so_tien co gia tri hop le

    var minutes = 1000 * 60
    var hours = minutes * 60
    var days = hours * 24

    var tu_ngay_parse = Date.parse(tu_ngay)
    var den_ngay_parse = Date.parse(den_ngay)

    var so_ngay_tinh_phat = Math.round(den_ngay_parse/days) - Math.round(tu_ngay_parse/days) + 1
    if (so_ngay_tinh_phat < 1) return ["Số ngày tính phạt của bạn có vấn đề: ngày kết thúc tính phạt phải hơn ngày bắt đầu tính. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]

    var ty_le_003 = 0.0003

    /*bat dau tinh phat chi tiet */
    var ty_le_005 = 0.0005
    var ty_le_007 = 0.0007

    var nam_2013 = new Date(2013, 5, 30) //Từ hạn nộp đến 30/6/2013: Tính theo tỷ lệ 0,05% (quy định của Luật số 78/2006/QH11)
    var nam_2014 = new Date(2014, 11, 31) //Từ ngày 1/7/2013 đến 31/12/2014: Khoản nợ <90 ngày tính theo tỷ lệ 0,05%; Khoản nợ >=90 ngày tính theo tỷ lệ 0,07% (quy định của Luật số 21/2012/QH13)
    var nam_2016 = new Date(2016, 5, 30) //Từ ngày 1/1/2015 - 30/6/2016: Tính theo tỷ lệ 0,05% (quy định của Luật số 71/2014/QH13). Từ ngày 1/7/2016: Tính theo tỷ lệ 0.03% (quy định của Luật số 106/2016/QH13)
    
    var nam_2013_convert = Math.round(Date.parse(nam_2013)/days) //30/6/2013
    var nam_2014_convert = Math.round(Date.parse(nam_2014)/days) //31/12/2014
    var nam_2016_convert = Math.round(Date.parse(nam_2016)/days) //30/6/2016

    var tu_ngay_convert = Math.round(tu_ngay_parse/days)
    var den_ngay_convert = Math.round(den_ngay_parse/days)

    //var tmp_so_ngay
    var tmp_so_tien_phat

    kq = [] //reset array kq
    //chia thanh cac giai doan thoi gian [ ;30/6/2013] [1/7/2013; 31/12/2014] [1/1/2015; 30/6/2016] [1/7/2016; ]
    
    if (tu_ngay_convert > nam_2016_convert) { //Nếu A >= 01/7/2016 --> B >= 01/7/2016: 0.03%
        tmp_so_tien_phat = Number(so_tien) * (den_ngay_convert - tu_ngay_convert + 1) * ty_le_003
        kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
    } else if (nam_2014_convert+1 <= tu_ngay_convert && tu_ngay_convert <= nam_2016_convert) { //Neu 01/01/2015 <= A <= 30/6/2016
        if (den_ngay_convert >= nam_2016_convert+1) { //Nếu B >= 01/7/2016
            //tmp = (nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005
            tmp_so_tien_phat = (nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //tu ngay - 30/6/2016:0.05%, 1/7/2016 - den ngay: 0.03%
            kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005))
            kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003))
        } else { //B nam cung giai doan voi A --> B - A + 1
            tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005
            kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
        }

    } else if (nam_2013_convert+1 <= tu_ngay_convert && tu_ngay_convert <= nam_2014_convert) { //Neu 1/7/2013 <= A <= 31/12/2014
        if (nam_2013_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2014_convert) { //neu B nam cung giai doan voi A
            if (den_ngay_convert - tu_ngay_convert + 1 <= 90) { //neu <= 90 ngay
                tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 //B - A + 1
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
            } else {
                tmp_so_tien_phat = 90 * Number(so_tien) * ty_le_005 + (den_ngay_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007 //tu ngay - 90:0.05%, tu ngay 91 - den ngay: 0.07%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date((tu_ngay_convert+89)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005))
                kq.push(milliseconds2date((tu_ngay_convert+90)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert - 90 + 1) + "x0,07% = " + number_format((den_ngay_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007))
            }
        } else if (nam_2014_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2016_convert) { //neu 1/1/2015 <= B <= 30/6/2016
            if (nam_2014_convert - tu_ngay_convert + 1 <= 90) { //neu <= 90 ngay
                tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 //B-A+1
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
            } else {
                tmp_so_tien_phat = 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007 + (den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 //90 ngay dau: 0.05%, tu ngay 91 - 31/12/2014: 0.07%, 1/1/2015 - den ngay: 0.05%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date((tu_ngay_convert+89)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005))
                kq.push(milliseconds2date((tu_ngay_convert+90)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - tu_ngay_convert - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007))
                kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005))
            }
        } else if (den_ngay_convert > nam_2016_convert) { //neu B >= 1/7/2016
            if (nam_2014_convert - tu_ngay_convert + 1 <= 90) { //neu <= 90 ngay
                tmp_so_tien_phat = (nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //tu ngay - 30/6/2016: 0.05%, 1/7/2016 - den ngay: 0.03%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005))
                kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003))
            } else {
                tmp_so_tien_phat = 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007 + (nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //90 ngay dau: 0.05%, tu ngay 91 - 31/12/2014: 0.07%, 1/1/2015 - 30/6/2016: 0.05%, 1/7/2016 - den ngay: 0.03%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date((tu_ngay_convert+89)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005))
                kq.push(milliseconds2date((tu_ngay_convert+90)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - tu_ngay_convert - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007))
                kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005))
                kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003))
            }
        }
    } else if (tu_ngay_convert <= nam_2013_convert) {//neu A <= 30/6/2013
        if (den_ngay_convert <= nam_2013_convert) {//neu B nam cung giai doan voi A: 0.05%
            tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005
            kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
        } else if (nam_2013_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2014_convert) { //neu 1/7/2013 <= B <= 31/12/2014: co tinh 0.05 va 0.07
            //tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 
            if ((nam_2013_convert+1) + 90 >= den_ngay_convert) { //neu <= 90 ngay
                tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 //tat ca deu la 0.05% 
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
            } else {
                tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 90 * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2013_convert+1) -90 + 1) * Number(so_tien) * ty_le_007 //tu ngay - 30/6/2013: 0.05%, 1/7/2013 - 90 ngay: 0.05%, tu ngay 91 - den ngay: 0.07%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2013_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2013_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005)) //tu ngay - 30/6/2013: 0.05%
                kq.push(milliseconds2date((nam_2013_convert+1)*days) + "-" + milliseconds2date((nam_2013_convert+90)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005)) //1/7/2013 - 90 ngay: 0.05%
                kq.push(milliseconds2date((nam_2013_convert+91)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2013_convert+1) -90 + 1) + "x0,07% = " + number_format((den_ngay_convert - (nam_2013_convert+1) -90 + 1) * Number(so_tien) * ty_le_007)) //tu ngay 91 - den ngay: 0.07%
            }
        } else if (nam_2014_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2016_convert) { //neu 1/1/2015 <= B <= 30/6/2016
            tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007 + (den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 //tu ngay - 30/6/2013: 0.05%, 1/7/2013 - 90 ngay: 0.05%, 91 ngay - 31/12/2014: 0.07%, 1/1/2015 - den ngay: 0.05%
            kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2013_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2013_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005)) //tu ngay - 30/6/2013: 0.05%
            kq.push(milliseconds2date((nam_2013_convert+1)*days) + "-" + milliseconds2date((nam_2013_convert+90)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005)) //1/7/2013 - 90 ngay: 0.05%
            kq.push(milliseconds2date((nam_2013_convert+91)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007)) //91 ngay - 31/12/2014: 0.07%
            kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005)) //1/1/2015 - den ngay: 0.05%
        } else if (den_ngay_convert > nam_2016_convert) {//neu B >= 1/7/2016
            tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007 + (nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //tu ngay - 30/6/2013: 0.05%, 1/7/2013 - 90 ngay: 0.05%, 91 ngay - 31/12/2014: 0.07%, 1/1/2015 - 30/6/2016: 0.05%, 1/7/2016 - den ngay: 0.03%
            kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2013_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2013_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005)) //tu ngay - 30/6/2013: 0.05%
            kq.push(milliseconds2date((nam_2013_convert+1)*days) + "-" + milliseconds2date((nam_2013_convert+90)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005)) //1/7/2013 - 90 ngay: 0.05%
            kq.push(milliseconds2date((nam_2013_convert+91)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007)) //91 ngay - 31/12/2014: 0.07%
            kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005)) //1/1/2015 - 30/6/2016: 0.05%
            kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003)) //1/7/2016 - den ngay: 0.03%

        }
    }

    kq.push("TỔNG TIỀN PHẠT NỘP CHẬM: " + number_format(Math.round(tmp_so_tien_phat)))

    return kq

    /*ket thuc tinh phat chi tiet*/

}

/*
//Rất tiếc là làm thành hàm riêng lại ko chạy
function htkk_version(){
    var url_htkk = 'http://www.gdt.gov.vn/wps/portal/home/hotrokekhai'
    var current_version = ''
    request(url_htkk, function(err, response, body){  
      if (!err && response.statusCode == 200) {
        var $ = cheerio.load(body)
        var txt = $('.news > div > a').text().trim()
        
        current_version = 'Phiên bản HTKK hiện tại đang là ' + txt.substr(txt.lastIndexOf(" "),txt.length-txt.lastIndexOf(" ")) + ' được nâng cấp ' + $('.news > div > span').text()
      }
      else current_version = 'Không xem được phiên bản của HTKK do kết nối tới máy chủ lỗi'
    })
    return current_version
}
*/


// Index route
app.get('/', function (req, res) {
    res.send('Access https://m.me/sanhonline to chat')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'sanh_online_fashion') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
  var data = req.body;



  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;


      // Iterate over each messaging event
      /*pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          receivedMessageRead(messagingEvent);
        } else if (messagingEvent.account_linking) {
          receivedAccountLink(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });*/
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've 
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some 
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've 
 * created. If we receive a message with an attachment (image, video, audio), 
 * then we'll simply confirm that we've received the attachment.
 * 
 */
function receivedMessage(event) {
  var sender = event.sender.id; //var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  /*console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));*/

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  /*
  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s", 
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }
  */

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    /*
    switch (messageText) {
      case 'image':
        sendImageMessage(senderID);
        break;

      case 'gif':
        sendGifMessage(senderID);
        break;

      case 'audio':
        sendAudioMessage(senderID);
        break;

      case 'video':
        sendVideoMessage(senderID);
        break;

      case 'file':
        sendFileMessage(senderID);
        break;

      case 'button':
        sendButtonMessage(senderID);
        break;

      case 'generic':
        sendGenericMessage(senderID);
        break;

      case 'receipt':
        sendReceiptMessage(senderID);
        break;

      case 'quick reply':
        sendQuickReply(senderID);
        break;        

      case 'read receipt':
        sendReadReceipt(senderID);
        break;        

      case 'typing on':
        sendTypingOn(senderID);
        break;        

      case 'typing off':
        sendTypingOff(senderID);
        break;        

      case 'account linking':
        sendAccountLinking(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    } */
    /*if (messageText === "postback") {
        for (var i = 0; i < 10; i++){
          sendPostback(senderID, a_catalogue[i]["description"], i)
        }
    }*/ //else { //bat dau xu ly cau hoi

        /*start*/
        //sender = event.sender.id
        //if (event.message && event.message.text) {
            text = " " + good_str((messageText).toLowerCase()) + " "

            var a_len = a.length
            var a_catalogue_len = a_catalogue.length
            var a_item = -1 //vi tri item cua a_catalogue
            var normal_item = -1 //vi tri item cua a
            var keyword_num = 0 //so tu khoa tim duoc cua a_catalogue
            var keyword_result = 0 //tong so tu khoa cua a_catalogue

            var keyword_num_normal = 0 //so tu khoa tim duoc cua a
            var keyword_result_normal = 0 //tong so tu khoa cua a

            var a_kq_tim_trong_catalogue = []

            for (var i = 0; i < a_catalogue_len; i++) {
                if (check(text, a_catalogue[i]["catalogue"]) > 0) {
                    //cho vao 1 mang nếu tìm đúng catalogue
                    a_kq_tim_trong_catalogue.push(i)

                    if (check(text, a_catalogue[i]["catalogue"]) > 0 && check(text, a_catalogue[i]["keyword"]) > keyword_num && check(text, a_catalogue[i]["keyword"]) > 0) {
                        a_item = i
                        keyword_result = a_catalogue[i]["keyword"].length
                        keyword_num = check(text, a_catalogue[i]["keyword"])   
                    } else if (check(text, a_catalogue[i]["catalogue"]) > 0 && check(text, a_catalogue[i]["keyword"]) == keyword_num && check(text, a_catalogue[i]["keyword"]) > 0) {
                        if (Number(a_catalogue[i]["keyword"].length) - Number(check(text, a_catalogue[i]["keyword"])) < Number(keyword_result) - Number(keyword_num)) {
                            a_item = i
                            keyword_result = a_catalogue[i]["keyword"].length
                            keyword_num = check(text, a_catalogue[i]["keyword"])
                        }
                    }
                }
            }
            //neu ko tim duoc trong catalogue: tim array a
            if (a_item < 0) {
                for (var i = 0; i < a_len; i++) {
                if (check(text, a[i]["keyword"]) > keyword_num_normal && check(text, a[i]["keyword"]) > 0) {
                    normal_item = i
                    keyword_result_normal = a[i]["keyword"].length
                    keyword_num_normal = check(text, a[i]["keyword"])   
                } else if (check(text, a[i]["keyword"]) == keyword_num_normal && check(text, a[i]["keyword"]) > 0) {
                    if (Number(a[i]["keyword"].length) - Number(check(text, a[i]["keyword"])) < Number(keyword_result_normal) - Number(keyword_num_normal)) {
                            normal_item = i
                            keyword_result_normal = a[i]["keyword"].length
                            keyword_num_normal = check(text, a[i]["keyword"])
                        }
                    }
                }
            }
            if (a_item < 0 && normal_item < 0) {//ko tim thay
                if (a_kq_tim_trong_catalogue.length > 0) {
                	sendTextMessage(sender, "Tôi chưa có dữ liệu bạn tìm. Dưới đây là các kết quả tương tự")
                  	sendGenericMessage(sender, a_kq_tim_trong_catalogue, item_show)
                } else sendTextMessage(sender, a_sorry)         
            } else {
                var array_item = a_item >= 0 ? a_catalogue[a_item]["answer"] : a[normal_item]["answer"]
                
                if (array_item[0] === "function:help"){
                    sendTextMessages(sender, help(a_catalogue, 5), 0)
                } else if (array_item[0] === "function:htkk_version"){
                    request(url_htkk, function(err, response, body){  
                        if (!err && response.statusCode == 200) {
                            var $ = cheerio.load(body)
                            var txt = $('.news > div > a').text().trim()
                        
                            sendTextMessage(sender, 'Phiên bản HTKK hiện tại đang là ' + txt.substr(txt.lastIndexOf(" "),txt.length-txt.lastIndexOf(" ")) + ' được nâng cấp ' + $('.news > div > span').text() + '\nTải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ')
                        }
                        else sendTextMessage(sender, 'Không xem được phiên bản của HTKK do kết nối tới máy chủ lỗi')
                    })
                } else if (array_item[0] === "function:search_tmuc") {

                    var search_tm = search_tmuc(text, a_tieumuc)
                    var search_tm_len = search_tm.length
                    var kq_tim_tmuc = []
                    if (search_tm_len === 0){
                        sendTextMessage(sender, "Tôi không tìm thấy tiểu mục này. Bạn xem danh sách đầy đủ tại đây http://adf.ly/1biHZ7")
                    } else {
                        if (search_tm_len > 30) {
                            //sendTextMessage(sender, "Có quá nhiều kết quả nên tôi chỉ liệt kê 1 phần. Bạn hãy giới hạn lại từ khóa tìm kiếm")
                            kq_tim_tmuc.push("Có quá nhiều kết quả nên tôi chỉ liệt kê 1 phần. Bạn hãy giới hạn lại từ khóa tìm kiếm")
                            search_tm_len = 29
                        }
                        for (var i = 0; i < search_tm_len; i++){
                            //sendTextMessage(sender, a_tieumuc[search_tm[i]]["tieumuc"]+" - "+a_tieumuc[search_tm[i]]["tentieumuc"])
                            kq_tim_tmuc.push(a_tieumuc[search_tm[i]]["tieumuc"] + " - " + a_tieumuc[search_tm[i]]["tentieumuc"])
                        }
                        kq_tim_tmuc.push("Bạn có thể xem danh sách đầy đủ tại đây http://adf.ly/1biHZ7")
                        sendTextMessages(sender, kq_tim_tmuc, 0)
                    }


                } else if (array_item[0] === "function:tinh_phat") {
                    var result_tinh_phat = tinh_phat(((messageText).toLowerCase()).replace(/\s{2,}/g," "))
                    sendTextMessages(sender, result_tinh_phat, 0)
                } else {
                    sendTextMessages(sender, array_item, 0)
                }
            }

        //}

        /*end*/

        /*if (messageText === "generic") {
            var arr = [1, 2, 3, 4, 5, 6, 7, 8] //tim thay tung nay kq  
            sendGenericMessage(senderID, arr, item_show)
        } else {
            sendTextMessage(senderID, "Toi da nhan duoc");
        }*/
    //}
    //ket thuc xu ly cau hoi
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Rất tiếc, tôi không xử lý những tin nhắn có đính kèm tệp :(");
  }
} //end function receivedMessage



/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;


  /*console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);*/

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  if (payload.substr(-8, 8) === ",xemtiep") {
  	var arr_split = payload.split(",")
  	arr_split.pop() //delete phan tu "xemtiep" ra khoi mang
  	sendGenericMessage(senderID, arr_split, item_show)
  } else {
    	var tmp = []
    	var tmp_show
    	tmp.push("Bạn đã hỏi: " + a_catalogue[payload]["description"])
    	for (var i = 0; i < a_catalogue[payload]["answer"].length; i++){
    		tmp_show = (a_catalogue[payload]["answer"][i].slice(0,8) === 'function') ? 'Bạn hãy gõ "' + a_catalogue[payload]["description"] + '" để xem câu trả lời' : a_catalogue[payload]["answer"][i]
    		tmp.push(tmp_show);
    	}
    	sendTextMessages(senderID, tmp, 0)
	}
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId, arr, item) { //arr: mang can duyet, item: so ban ghi can hien thi
  var tmp
  var json_tmp = []
  var length_item = (arr.length >= item) ? item : arr.length
  for (var i = 0; i < length_item; i++){
  		tmp = '{' +
	  		'"title":"' + a_catalogue[arr[i]]["description"] + '",' +
	  		'"subtitle":"",' +
	  		'"item_url":"",' +
	  		'"image_url":"https://c4.staticflickr.com/9/8138/29980622835_735846730d.jpg",' +
	  		'"buttons": [{' +
	  		           '"type":"postback",' +
	  		           '"title":"Xem",' +
	  		           '"payload":' + arr[i] +
	  		           '}]' +
	  		'}'
		json_tmp.push(JSON.parse(tmp))

  }
  if (arr.length > item) {
  		arr.splice(0, item) //xóa các item đã hiển thị ra khỏi mảng
	  	tmp = '{' +
	  		'"title":"Xem các câu hỏi trợ giúp khác",' +
	  		'"subtitle":"",' +
	  		'"item_url":"",' +
	  		'"image_url":"https://c1.staticflickr.com/9/8125/29372298304_a83d9dfc80_o.png",' +
	  		'"buttons": [{' +
	  		           '"type":"postback",' +
	  		           '"title":"Tiếp tục",' +
	  		           '"payload":"' + arr.join() + ',xemtiep"' +
	  		           '}]' +
	  		'}'
		json_tmp.push(JSON.parse(tmp))
  }


  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: json_tmp
        }
      }
    }
  };  

  callSendAPI(messageData);
}


function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendTextMessages(sender, text, i) {
    if (i < text.length) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: {text:text[i]},
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
            sendTextMessages(sender, text, i+1)
        })
    } else return
}
/*function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}*/

function sendPostback(recipientId, messageText, item){

  var messageData = {
    recipient: {
      id: recipientId
    },

    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"generic",
          elements:[
            {
              title:messageText,
              item_url:" ",
              image_url:" ",
              subtitle:" ",
              buttons:[
                {
                  type:"postback",
                  title:"Xem",
                  payload:item
                }
              ]
            }
          ]
        }
      }
    }

  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s", 
        recipientId);
      }
    } else {
      console.error(response.error);
    }
  });  
}
