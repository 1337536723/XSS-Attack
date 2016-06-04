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
