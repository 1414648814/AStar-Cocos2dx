
var changeType = {
    CHANGE_Wall_Frequency : 1,
    CHANGE_Grid_Size : 2,
};

var NCheckBox = cc.Node.extend({
    ctor : function () {
        cc.Node.prototype.ctor.call(this);

        this.setContentSize(100, 30);
        var size = cc.director.getWinSize();

        var text = new ccui.Text();
        text.setFontName("Marker Felt");
        text.setFontSize(20);
        text.setAnchorPoint(0, 0.5);
        text.setPosition(cc.p(0, this.getContentSize().height/2));
        this._text = text;
        this.addChild(text);

        var checkbox = new ccui.CheckBox("res/check_box_normal.png", "res/check_box_active.png");
        checkbox.setAnchorPoint(0, 0.5);
        checkbox.setTouchEnabled(true);
        checkbox.addEventListener(this.eventSelectCheckBox.bind(this, checkbox), this);
        this._checkbox = checkbox;
        this.addChild(checkbox);
    },

    setTextContent : function (content) {
        this._text.setString(content);
        this._checkbox.setPosition(cc.p(this._text.getContentSize().width + 10, this.getContentSize().height/2));
    },

    eventSelectCheckBox : function (checkbox) {
        return checkbox.isSelected();
    },

    _text : null,
    _checkbox : null,

});

NCheckBox.create = function () {
    return new NCheckBox();
};

var NDropDownMenu = cc.Node.extend({
    ctor : function () {
        
    },

});

NDropDownMenu.prototype.create = function () {
    return new NDropDownMenu();
};

var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        this.initMainUI();

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
        this._checkboxs = [];
        this._dropdowns = [];
        // 下拉选择框


        // 复选框内容
        var boxCentent = ["显示搜索信息", "对角线移动", "尽可能接近目标", "添加任意权值", "显示权值"];
        for (var i = 0; i < boxCentent.length; i++) {
            var checkbox = NCheckBox.create();
            checkbox.setAnchorPoint(0, 1);
            checkbox.setPosition(0, size.height - i * checkbox.getContentSize().height);
            checkbox.setTextContent(boxCentent[i]);
            checkbox.setTag(i+1);
            this.addChild(checkbox);
            this._checkboxs.push(checkbox);
        }

    },

    /**
     * 初始化
     */
    initData : function () {
        this._grids = [];
        var nodes = [];

        
    },

    initMapData : function (num) {
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
            for (var i = 0; i < 10; i++)
            {
                for (var i = 0; i < 10; i++)
                {

                }
            }
        }
    },
    
    createMap : function () {
        
    },

    getGridSize : function () {
        return this._grid_size;
    },

    getWallFrequency : function () {
        return this._wall_frequency;
    },


    _uiNode : null,
    _mapNode : null,

    _maps : null,
    _grids : null,

    _checkboxs : null,
    _dropdowns : null,

    _wall_frequency : null,
    _grid_size : null,

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
