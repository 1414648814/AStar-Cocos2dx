/**
 * Author: George1994(wangdading)
 * CreateTime: 16/6/21.
 * Description: 调用A星的实现,提供一些函数接口
 */

var Finding = cc.Class.extend({
    ctor : function () {
        this.tiles = [];
        this.size = cc.size(0, 0);  //width和height
        this.smooth = false;
        this.diagonally = true;
    },

    build : function () {
        this.system = new AStar(this.tiles);
    },

    setAstar : function (tiles, size, smooth, diagonally, flip_x) {
        this.setTile(tiles);
        this.setSize(size);
        this.setSmooth(smooth);
        this.setDiagonally(diagonally);
    },

    setTile : function (tiles) {
        var m = tiles.length;
        var n = tiles[0].length;

        for (var i = 0; i < m; i++)
        {
            for (var j = 0; j < n; j++)
            {
                this.tiles.push(tiles[i][j]);
            }
        }
    },

    getTile : function () {
        return this.tiles.slice();
    },

    setSize : function (size) {
        this.size = size;
    },

    getSize : function () {
        return this.size;
    },

    setSmooth : function (smooth) {
        this.smooth = smooth;
    },

    getSmooth : function () {
        return this.smooth;
    },

    setDiagonally : function (diagonally) {
        this.diagonally = diagonally;
    },

    getDiagonally  : function () {
        return this.getDiagonally();
    },

    system : null,
    tiles  : null,

    smooth : false,
    diagonally : true,

});

