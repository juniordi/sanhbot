var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 8080))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

var PAGE_ACCESS_TOKEN = "EAASYDIKLwzQBABj9T2HVFTeb4UanDDZBtecPcUIQINXv8eMU2ZBD0XiO5nLc1c1aJbvwkf0OEKeDAn4eTJK4hBlJTLcnHNw84XJSZCUzMcifPiIE3gsBFU8oSrx6ZBitPLTRGy1LZAlZCmUJ8jYV9ZCwc7a93xhzbGotqkfw3pKCQZDZD"

//test catalogue
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
        "keyword": [[" phiên bản ", " version ", " bản "]],
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
    }
]
var item_show = 3

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
  var senderID = event.sender.id;
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
    if (messageText === "postback") {
        for (var i = 0; i < 10; i++){
          sendPostback(senderID, a_catalogue[i]["description"], i)
        }
        //sendPostback(senderID, messageText)
    } else if (messageText === "generic") {
        //for (var i = 0; i < 10; i++){
        var arr = [1, 2, 3, 4, 5, 6, 7, 8] //tim thay tung nay kq	
        sendGenericMessage(senderID, arr, item_show)
        //}
    } else sendTextMessage(senderID, "Toi da nhan duoc");
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Toi da nhan duoc tin nhan co dinh kem tep");
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
	  sendTextMessage(senderID, "Bạn đã hỏi: " + a_catalogue[payload]["description"])
	  for (var i = 0; i < a_catalogue[payload]["answer"].length; i++){
	    sendTextMessage(senderID, a_catalogue[payload]["answer"][i]);
	  }
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
	  		'"image_url":"https://c4.staticflickr.com/9/8138/29980622835_735846730d_b.jpg",' +
	  		'"buttons": [{' +
	  		           '"type":"postback",' +
	  		           '"title":"Xem",' +
	  		           '"payload":' + arr[i] +
	  		           '}]' +
	  		'}'
		json_tmp.push(JSON.parse(tmp))

  }
  if (arr.length > item) {
  		arr.splice(0, item)
	  	tmp = '{' +
	  		'"title":"Xem các câu hỏi trợ giúp khác",' +
	  		'"subtitle":"",' +
	  		'"item_url":"",' +
	  		'"image_url":"",' +
	  		'"buttons": [{' +
	  		           '"type":"postback",' +
	  		           '"title":"Tiếp tục",' +
	  		           '"payload":"' + arr.join() + ',xemtiep"' +
	  		           '}]' +
	  		'}'
		json_tmp.push(JSON.parse(tmp))
  }
  //tmp = tmp.slice(0, tmp.length-1)


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


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

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
