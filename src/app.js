var changeType = {
    CHANGE_Wall_Frequency : 1,
    CHANGE_Grid_Size : 2,
};

var NCheckBox = cc.Node.extend({
    ctor : function () {
        this._super();

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
        checkbox.addEventListener(this.getSelectCheckBoxState.bind(this, checkbox), this);
        this._checkbox = checkbox;
        this.addChild(checkbox);
    },

    setTextContent : function (content) {
        this._text.setString(content);
        this._checkbox.setPosition(cc.p(this._text.getContentSize().width + 10, this.getContentSize().height/2));
    },

    getSelectCheckBoxState : function () {
        return this._checkbox.isSelected();
    },

    _text : null,
    _checkbox : null,

});

NCheckBox.create = function () {
    return new NCheckBox();
};

var NDropDownMenu = cc.Node.extend({
    ctor : function () {
        this._super();
    },

    getOptionValue : function () {
        return this._curOptionVal;
    },

    setOptionValues : function (arr) {
        this._OptionVals = arr;
    },

    _curOptionVal : null,
    _OptionVals : null,

});

NDropDownMenu.create = function () {
    return new NDropDownMenu();
};

var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        this.initMainUI();
        this.initMapData();

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
        // (暂时)
        this._grid_size = 20;
        this._wall_frequency = 0.1;

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

        // 生成地图按钮
        var createMapBtn = new ccui.Button;
        createMapBtn.setTouchEnabled(true);
        createMapBtn.loadTextures("res/6.png", "res/6.png", "res/6.png");
        createMapBtn.setTitleText("生成地图");
        createMapBtn.setAnchorPoint(0, 0);
        createMapBtn.setPosition(20, 20);
        createMapBtn.addClickEventListener(this.refreshData);
        this.addChild(createMapBtn);
    },

    /**
     * 初始化地图数据
     */

    initMapData : function () {
        this._search = AStar.SearchPath;
        this._grids = [];
        var nodes = [];
        var startSet = false;

        var num = this.getGridSize() == null ? 40 : this.getGridSize();
        for (var i = 0; i < num; i++) {
            var gridRow = [], nodeRow = [];
            for (var j = 0; j < num; j++) {
                var grid = Grid.create(i, j);
                grid.setTouchEnabled(true);
                grid.setScale(0.4);
                grid.setAnchorPoint(0, 0);
                grid.setPosition(200 + j * 63 * 0.4, i * 63 * 0.4);
                grid.addClickEventListener(this.clickGrid.bind(this,grid));
                gridRow.push(grid);
                this.addChild(grid);

                var isWall = Math.floor(Math.random() * (1 / this.getWallFrequency()));
                if (isWall === 0) {
                    grid.setWall();
                    nodeRow.push(0);
                }
                else {
                    var grid_height = this._checkboxs[4].getSelectCheckBoxState() ? Math.floor(Math.random() * 3) * 2 + 1 : 1;
                    nodeRow.push(grid_height);
                    if (!startSet) {
                        grid.setStart();
                        startSet = true;
                        this._startItem = grid;
                    }
                }
            }

            this._grids.push(gridRow);
            nodes.push(nodeRow);
        }

        this._graph = new Graph(nodes);

    },

    getGridCellItem : function (item) {
        return this._graph.grid[parseInt(item.getX())][parseInt(item.getY())];
    },

    clickGrid : function (sender) {
        if (this._path_running)
            return ;

        console.log("the (" + sender.getX() +"," + sender.getY() + ") click it");
        if (sender.getState() == GridState.GRID_START || sender.getState() == GridState.GRID_START) {
            return ;
        }
        var end = this.getGridCellItem(sender);
        var start = this.getGridCellItem(this._startItem);

        this._closet_target = true;
        var path = this._search(this._graph, start, end, this._options);
        if (path.length === 0) {
            this.animateNoPath();
        }
        else {
            this.animatePath(path);
            this._grids[this._startItem.getX()][this._startItem.getY()].setNormal();
            this._grids[sender.getX()][sender.getY()].setEnd();
            this._startItem = sender;
            this._path_running = false;
        }
    },

    animateNoPath : function () {

    },

    animatePath : function (path) {
        this._path_running = true;

        var FadeToGreenAction = function (node) {
            node.setStart();
        };
        var FadeToYellowAction = function (node) {
            node.setNormal();
        };

        for (var i = 0; i < path.length - 1; i++) {
            var grid = this._grids[path[i].getX()][path[i].getY()];
            grid.runAction(cc.sequence(
                cc.callFunc(FadeToGreenAction.bind(this, grid)),
                cc.delayTime(0.25),
                cc.callFunc(FadeToYellowAction.bind(this, grid))
            ).repeat(10));
        }
    },

    
    refreshData : function () {
        console.log("refresh map");
        this.initMapData();
    },

    getGridSize : function () {
        return this._grid_size;
    },

    getWallFrequency : function () {
        return this._wall_frequency;
    },

    getDisplaySearchInfo : function () {
        return this._checkboxs[0].getSelectCheckBoxState();
    },

    getAllowDiagonally : function () {
        return this._checkboxs[1].getSelectCheckBoxState();
    },

    getClosetTarget : function () {
        return this._checkboxs[2].getSelectCheckBoxState();
    },

    getAddRamdomHeight : function () {
        return this._checkboxs[3].getSelectCheckBoxState();
    },

    getDisplayHeight : function () {
        return this._checkboxs[4].getSelectCheckBoxState();
    },

    getOptions : function () {

        this._options = {
            wallFrequency : this.getWallFrequency(),
            gridSize : this.getGridSize(),
            debug : this.getDisplaySearchInfo(),
            diagonal : this.getAllowDiagonally(),
            closest : this.getClosetTarget(),
        };

        return this._options;
    },

    _uiNode : null,
    _mapNode : null,

    _search : null,
    _graph : null,
    _path_running : false,

    _startItem : null,

    _maps : null,
    _grids : null,

    _checkboxs : null,
    _dropdowns : null,

    _options : null,

    _wall_frequency : null,
    _grid_size : null,

    _display_search_info : false,
    _allow_diagonally : false,
    _closet_target : false,
    _add_random_weight : false,
    _display_weight : false,

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
