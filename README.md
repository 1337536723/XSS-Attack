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
