
var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var size = cc.winSize;

        //this._uiNode = new cc.Sprite("");
        //this.addChild(this._uiNode);
        //
        //this._mapNode = cc.Sprite("");
        //this.addChild(this._mapNode);

        //this.initMainUI();

        return true;
    },

    /**
     * 功能UI应该包括
     * 1.可以设置墙的频率问题(下拉选择框)
     * 2.设置方格的数目问题(下拉选择框)
     * 3.显示搜索信息(复选框)
     * 4.是否允许对角线移动(复选框)
     * 5.如果目标不可以到达,尽可能接近(复选框)
     * 6.添加任意的权值(复选框)
     * 7.显示权值(复选框)
     */
    initMainUI : function () {
        var size = cc.director.getWinSize();

        //text_show_search_info
        var text1 = new ccui.Text("show_search_info", "Marker Felt", 20);
        text1.setAnchorPoint(cc.p(0, 1));
        text1.setPosition(cc.p(0, size.height - 20));
        this._text_show_search_info = text1;
        this.addChild(text1);

        //checkbox_show_search_info
        var checkbox1 = new ccui.CheckBox("res/check_box_normal.png", "res/check_box_active.png");
        checkbox1.setAnchorPoint(0, 1);
        checkbox1.setPosition(cc.p(text1.getContentSize().width + 10, size.height - 20));
        checkbox1.setTouchEnabled(true);
        checkbox1.addEventListener(this.checkboxSelect, this);
        this._checkbox_show_search_info = checkbox1;
        this.addChild(checkbox1);

        
    },

    initMap : function (num) {
        var havenum = num == null ? false : true;
        if (havenum)
        {
            for (var i = 0; i < num; i++)
            {
                for (var i = 0; i < num; i++)
                {
                    
                }
            }
        }
        else
        {
            for (var i = 0; i < 15; i++)
            {
                for (var i = 0; i < 15; i++)
                {

                }
            }
        }
    },
    
    createMap : function () {
        
    },

    checkboxSelect : function (sender, type) {
        switch (type)
        {
            case ccui.CheckBox.EVENT_UNSELECTED:
                console.log("UNSELECTED");
                break;
            case ccui.CheckBox.EVENT_SELECTED:
                console.log("SELECTED");
                break;
            default:
                break;
        }
    },

    _uiNode : null,
    _mapNode : null,

    _maps : null,

    _text_show_search_info : null,
    _checkbox_show_search_info : null,

    _text_allow_diagonally : null,
    _checkbox_allow_diagonally : null,

    _text_closet_target : null,
    _checkbox_closet_target : null,

    _text_add_random_weight : null,
    _checkbox_add_random_weight : null,

    _text_display_weight : null,
    _checkbox_display_weight : null,

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
