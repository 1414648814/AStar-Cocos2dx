/**
 * Author: George1994(wangdading)
 * CreateTime: 16/6/22.
 * Description: 小方格
 */

function grid(x,y,size)
{
    this.x = x;
    this.y = y;
    this.size = size;
};

//get/set函数
grid.prototype.setX = function (x) {
    this.x = x;
};
grid.prototype.getX = function (x) {
    return this.x;
};
grid.prototype.setX = function (y) {
    this.y = y;
};
grid.prototype.getX = function (y) {
    return this.y;
};
grid.prototype.setX = function (size) {
    this.size = size;
};
grid.prototype.getX = function (size) {
    return this.size;
};


