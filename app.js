var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port:'3306',
    user: 'root',
    password: 'chen8888',
    database: 'telegram'
});
connection.connect();

var TelegramBot = require('node-telegram-bot-api');
var token = '298404287:AAEn1SNVbTp6HtvcqtltPHIoXUzWJHsmeIE';
var bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, message => {
  var group = message.chat.id;
  bot.sendMessage(group, 'Hello World');
});

bot.onText(/\/show/, message => {
  var group = message.chat.id;
  var user = message.from.id;
  var name = message.from.username;
  var query1 = "INSERT INTO telegram.table (name_id, posts, group_id, name) SELECT "+user+", 0, "+group+", '"+name+"' FROM dual WHERE not exists (select * from telegram.table where name_id = "+user+" and group_id = "+group+");"
  connection.query(query1,function(error){
            console.log('嘗試寫入資料');
            if(error){
                console.log('寫入資料失敗！');
                throw error;
            }
            else console.log('成功寫入資料');
  });
  var query3 = "SELECT posts FROM telegram.table where name_id = "+user+" and group_id = "+group+";"
  connection.query(query3,function(err,row,field){
            console.log('嘗試讀取資料');
            if(row[0].posts==0){
                console.log('讀取資料失敗！');
                bot.sendMessage(group, "null");
            }
            else {
                console.log('成功讀取資料');
                console.log(row);
                bot.sendMessage(group, row[0].posts);
            }
  });
});


bot.onText(/^[^\/]/, message => {//正則過濾掉命令
  console.log(message); // for debug
  var group = message.chat.id;
  var user = message.from.id;
  var name = message.from.username;
  var query1 = "INSERT INTO telegram.table (name_id, posts, group_id, name) SELECT "+user+", 0, "+group+", '"+name+"' FROM dual WHERE not exists (select * from telegram.table where name_id = "+user+" and group_id = "+group+");"
  connection.query(query1,function(error){
            console.log('嘗試寫入資料');
            if(error){
                console.log('寫入資料失敗！');
                throw error;
            }
            else console.log('成功寫入資料');
  });
  var query2 = "UPDATE telegram.table SET posts=posts+1 WHERE name_id = "+user+" and group_id = "+group+";"
  connection.query(query2,function(error){
            console.log('嘗試更新資料');
            if(error){
                console.log('更新資料失敗！');
                throw error;
            }
            else console.log('成功更新資料');
  });
});
