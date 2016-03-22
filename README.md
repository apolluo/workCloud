# workCloud
基于node-webkit + angular的js打包工具。目前支持两种打包方式：

1、命令行

  对于本地已经配置好的项目，例如：项目已经采用gulp方式，通过cmd执行下面命令来打包 
  ```bash
  D: 
  cd D:\myProj\branches\
  gulp myproj
  ```
  那么我们将下面的命令行填入命令行选项，然后点运行按钮，项目就会开始打包
  ```bash
  D: && cd D:\\myProj\\branches\\ && gulp myproj
  ```
2、gulp

  对于新的项目，可以用系统默认的gulp方式进行打包。无需安装gulp等一系列node插件，只需要将配置文件wc_gulp_config.js复制到你的项目下，
  然后填好相应配置：
  ```js
  //要编译的项目目录
  path: 'D:\\myProj',
  //要编译的文件
  //src: '*_temp.js',['js/**/*.js', '!js/**/*.min.js'],
  src: '\\src\\*_temp.js',
  //type:'concat/temp', concat采用文件合并的方式 temp采用模版的方式进行发布
  type: 'temp',
  //debug目录
  debug: {
    path: 'D:\\myProj\\debug',
    name: 'dia_debug.js'
  },
  //发布目录
  release: {
    path: 'D:\\myProj\\release',
    name: 'dia_release.js'
  }
  ```

#为什么使用？

1、轻松管理多个项目，每个项目可以添加多种配置来实现不同的打包方式。

2、无需反复安装，不需要将各种node插件安装到项目目录下。

3、轻松管理已经安装好的node插件，删除、更新不在是麻烦
