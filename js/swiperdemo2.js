//封装为jqurey插件
!function (t) {
    
    //设置插件输入方式
    function A(t,element) {
        this.init(t,element)
    }
    //设置接口为：element.swiper(data)
    t.fn.swiper = function (data) {
        return this.each(function () {
            new A(t(this),data);
        })
    };
    //设置插件的原型，对调用插件的对象进行处理
    A.prototype = {

        //初始化
        init: function (element,data) {
            this.element = element;
            this.data = $.extend({},{
                direction:"right",   //如果设置自动滚动，值为"left"向左，值为"right"向右 默认"right"
                ratio:16/9,            //设置图片宽高比  默认16/9
                time:3000,             //自动滚动间隔，单位：毫秒，为0时不自动滚动  默认3秒
                base:!0,               //是否创建底部按钮，值为"true"或"flase"  默认"true"
                btn:!0,                //是否显示左右按钮，值为"true"或"flase"   默认"true"
                over:!0,               //是否拥有鼠标经过动画，值为"true"或"flase"   默认"true"
                stop: !0,              //是否鼠标悬停停止滚动，值为"true"或"flase"   默认"true"
            },data);

            //取得图片数据
            this.boxleft = parseInt(element.css('width'));
            this.listleft = -this.boxleft;
            this.listchild = element.find('ul').children().length;

            //复制幻灯片第一和最后
            let firstchild = this.element.find('li')[0];
            let lastchild = this.element.find('li')[this.listchild-1];
            this.element.find('ul').append(firstchild.cloneNode(true));
            this.element.find('ul').prepend(lastchild.cloneNode(true));
            this.listchild = this.element.find('ul').children().length;

            //运行组件
            this.assembly()
        },

        //配置组件
        assembly:function () {
            this.adaption();
            this.btn();
            this.data.base && this.base();
            this.click(this.element);
            if(this.data.time !== 0){
                this.Auto(this.element,this.data.direction);
            }
            this.data.over &&this.mouseover()
        },

        //创建左右按钮
        btn:function () {
            let btnnext = document.createElement('div');
            btnnext.setAttribute('class','next');
            let btnprev = document.createElement('div');
            btnprev.setAttribute('class','prev');
            //显示或隐藏左右按钮
            if(this.data.btn === false){
                btnnext.style.display = "none";
                btnprev.style.display = "none";
            }
            this.element.append(btnnext);
            this.element.append(btnprev);
            this.element.find(".next").css('top',(this.boxleft/this.data.ratio - 45)/2);
            this.element.find(".prev").css('top',(this.boxleft/this.data.ratio - 45)/2);
        },

        //设置图片及盒子大小
        adaption: function () {
            this.element.css('height', this.boxleft /this.data.ratio);
            this.element.find('ul').css({'width': this.listchild * 100 + "%", 'left': this.listleft});
            this.element.find('li').css({'width': this.boxleft, 'height': this.boxleft/this.data.ratio});
            this.element.find('img').css({'width': this.boxleft, 'height': this.boxleft/this.data.ratio});
        },

        //创建底部按钮
        base: function () {
            let ol = document.createElement('ol');
            ol.setAttribute('class', 'nav');
            for (let i = 0; i < this.listchild-2; i++) {
                let li = document.createElement('li');
                ol.appendChild(li);
            }
            ol.style.left = (this.boxleft - 30 * (this.listchild - 2) - 10) / 2 + "px";
            ol.children[0].className = "action";
            this.element.append(ol);
        },

        //绑定点击事件
        click:function (element) {
            let next = this.element.find('.next'),prev =this.element.find('.prev'),base = this.element.find('.nav');
            let data = {
                    boxleft : parseInt(element.css('width')),
                    listleft : -1*(parseInt(element.css('width'))),
                    listchild : element.find('ul').children().length,
                    index :0,
                    flag : true,
                };
            next.on("click",data,function (d) {
                if(data.flag){
                    data.index++;
                    setTimeout(function () {
                        if(data.index > (data.listchild-3)){
                            element.find('ul').css("left",data.listleft);
                            data.index = 0;
                        }
                    },410);
                    let mr = data.index*data.listleft+data.listleft + "px";
                    element.find('ol').children().eq(data.index-1).removeClass('action');
                    if(data.index > (data.listchild-3)){
                        element.find('ol').children().eq(0).addClass('action');
                    }
                    element.find('ol').children().eq(data.index).addClass('action').siblings().removeClass('action');
                    element.find('ul').animate({left:mr});
                    data.flag = false;
                    setTimeout(function () {
                        data.flag = true;
                    },410);
                }
            });
            prev.on("click",data,function (d) {
                if(data.flag){
                    data.index--;
                    setTimeout(function () {
                        if(data.index < 0){
                            element.find('ul').css("left",data.listleft*(data.listchild-2));
                            data.index = data.listchild-3;
                        }
                    },410);
                    let ml = data.index*data.listleft+data.listleft + "px";
                    element.find('ul').animate({left:ml});
                    element.find('ol').children().eq(data.index).addClass('action').siblings().removeClass('action');
                    data.flag = false;
                    setTimeout(function () {
                        data.flag = true;
                    },410);
                }
            });

            let nav = base.children();
                for (let j=0;j<nav.length;j++){
                    (function (j) {
                        let moveleft = j*data.listleft+data.listleft+"px";
                        nav[j].onclick = function () {
                            element.find('ul').animate({left:moveleft});
                            element.find('ol').children().eq(j).addClass('action').siblings().removeClass('action');
                            data.index = j;
                        }
                    })(j);
                }

        },

        //绑定鼠标经过事件
        mouseover:function () {
            //动画
            let next = this.element.find('.next'),prev =this.element.find('.prev'),base = this.element.find('.nav');
            this.element.on('mouseover',function () {
                next.css("opacity",0.5);
                prev.css("opacity",0.5)
            });
            this.element.on('mouseout',function () {
                next.css("opacity",0);
                prev.css("opacity",0);
            })
        },

        //设置自动滚动
        Auto : function (element,direction) {
            function auto(){ //打开定时器
                if(direction === "right"){
                    element.find('.next').trigger("click"); //模拟触发按钮的click事件
                }
                else if(direction === "left"){
                    element.find('.prev').trigger("click"); //模拟触发按钮的click事件
                }
                else {
                    element.find('.next').trigger("click"); //模拟触发按钮的click事件
                }
            }
            let time = this.data.time;
            let timer=setInterval(auto,time);
            if(this.data.stop === true){
                this.element.on('mouseover',function () {
                    clearInterval(timer)//清除定时器
                });
                this.element.on('mouseout',function () {
                    timer=setInterval(auto,time);
                })
            }
        }
    }

}(jQuery);