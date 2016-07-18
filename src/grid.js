/**
 * Author: George1994(wangdading)
 * CreateTime: 16/6/22.
 * Description: 小方格
 */

var GridState = {
    GRID_NORMAL : 1,
    GRID_WALL : 2,
    GRID_START : 3,
    GRID_END : 4,
};

var Grid = ccui.Button.extend({
    ctor : function (x, y) {
        this._super();

        this._x = x;
        this._y = y;
        this._state = GridState.GRID_NORMAL;
        this.loadTextures("res/4.png","res/4.png","res/4.png");
    },

    setX : function (x) {
        this._x = x;
    },

    getX : function () {
        return this._x;
    },

    setY : function (y) {
        this._y = y;
    },

    getY : function () {
        return this._y;
    },

    getState : function () {
        return this._state;
    },

    setState : function (state) {
        this._state = state;
    },

    setStart : function () {
        this.loadTextures("res/5.png","res/5.png","res/5.png");
        this._state = GridState.GRID_START;
    },

    setEnd : function () {
        this.loadTextures("res/5.png","res/5.png","res/5.png");
        this._state = GridState.GRID_END;
    },

    setWall : function () {
        this.loadTextures("res/2.png","res/2.png","res/2.png");
        this.setTouchEnabled(false);
        this._state = GridState.GRID_WALL;
    },

    setNormal : function () {
        this.loadTextures("res/4.png","res/4.png","res/4.png");
        this._state = GridState.GRID_NORMAL;
    },

    setTest : function () {
        this.loadTextures("res/6.png","res/6.png","res/6.png");
        this._state = GridState.GRID_NORMAL;
    },

    toString : function () {
        return "[" + this.getX() + "," + this.getY() + "]";
    },

    //setModeScale : function (enale, scale) {
    //    if (enale)
    //        this.setScale(scale);
    //    else
    //        this.setScale(1);
    //},

    _x : null,
    _y : null,
    _state : null,

});

Grid.create = function (x, y) {
    return new Grid(x, y);
};
