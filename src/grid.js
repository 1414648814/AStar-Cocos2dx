/**
 * Author: George1994(wangdading)
 * CreateTime: 16/6/22.
 * Description: 小方格
 */

var GridSelectState = {
    GRID_SELECTED : 1,
    GRID_UNSELECTED : 2,
};

var Grid = cc.Sprite.extend({
    ctor : function (x,y,size) {
        this._x = x;
        this._y = y;
        this._size = size;
        this._state = GridSelectState.GRID_UNSELECTED;
        var node = new cc.sprite("res/0.png",cc.rect(0,0,63,63));
        this.addChild(node);
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

    setSize : function (size) {
        this._size = size;
    },

    getSize : function () {
        return this._size;
    },

    getState : function () {
        return this._state;
    },

    setState : function (state) {
        this._state = state;
    },

    _x : null,
    _y : null,
    _size : null,
    _state : null,

});
