const http=require ('http');
var requests = require('requests');
const fs=require('fs');

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",(orgVal.list[0].main.temp-=273).toFixed(2)) ;
     temperature=temperature.replace("{%tempmin%}",(orgVal.list[0].main.temp_min-=273).toFixed(2)) ;
     temperature=temperature.replace("{%tempmax%}",(orgVal.list[0].main.temp_max-=273).toFixed(2)) ;
     temperature=temperature.replace("{%location%}",orgVal.city.name) ;
     temperature=temperature.replace("{%country%}",orgVal.city.country) ;
     temperature=temperature.replace("{%tempStatus%}",orgVal.list[0].weather[0].main) ;
     return temperature;
 }

const homeFile= fs.readFileSync('Home.html',"utf-8");
const server= http.createServer((req,res)=>{
if(req.url=='/'){
    requests('https://api.openweathermap.org/data/2.5/forecast?q=Pune&appid=74e8275d3708b49d2cc42aeaf61508ac').on("data",(chunk)=>{
        // console.log(chunk)
        const dataJson= JSON.parse(chunk);
        
        const arrData=[dataJson];

           
       
            const realTimeData=arrData.map(val=>
                replaceVal(homeFile,val)  ).join("")
                console.log(arrData[0].city.country)
                console.log(arrData[0].list[0].main.temp_max)
                res.write(realTimeData);
                // console.log(realTimeData)
    })
    .on("end",(err)=>{
      if(err)  return console.log("error cause ", err);
        console.log("end");
        res.end();
    })
}
    
});
server.listen(3002,()=>{
    console.log("port running on 8000")
})
