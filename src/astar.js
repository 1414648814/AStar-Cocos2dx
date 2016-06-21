/**
 * Author: George1994(wangdading)
 * CreateTime: 16/6/21.
 * Description: 实现A星算法
 */

// A星对象
var AStar = cc.Class.extend({

    ctor : function (tiles) {
        if (tiles)
        //初始化
            this.setTiles(tiles);
    },

    // 搜索函数
    SearchPath : function(start, end, options) {
        options = options || {};
        var heuristic = AStar.manhattan;
        var closest = options.closest || false;

        var openHeap =  new BinaryHeap(function(node) {
            node.f;
        });

        var closetNode = start;
        start.h = AStar.manhattan(start,end);

        openHeap.push(start);

        while(openHeap.size() > 0){
            //取出尾节点
            var currentNode = openHeap.pop();

            //找到结果
            if(currentNode === end)
                return this.pathTo(currentNode);

            //移动节点从开列表到闭列表
            currentNode.closed = true;

            //找出所有邻居节点
            var neighbors = this.neighbors(currentNode);

            for(var i = 0;i < neighbors.length;++i){
                var neighbor = neighbors[i];

                //闭列表中的和不可到达则不访问
                if(neighbor.closed || neighbor.isWall()){
                    continue;
                }

                //计算g值
                var gScore = currentNode.g + neighbor.getCost(currentNode);
                var beenVisited = neighbor.visited;

                //如果邻居节点没有访问过或者节点到达邻居节点的路径长度更短
                if(!beenVisited || gScore < neighbor.g){
                    neighbor.visited = true;
                    neighbor.parent = currentNode;

                    //重新计算h,g值
                    neighbor.h = neighbor.h || manhattan(neighbor,end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if(closest){
                        if (neighbor.h  < closetNode.h || (neighbor.h === closetNode.h && neighbor.g < closetNode.g)) {
                            closetNode = neighbor;
                        }
                    }

                    if(!beenVisited){
                        openHeap.push(neighbor);
                    }
                    else{
                        openHeap.RescoreElement(neighbor);
                    }
                }

            }

        }
        //找到靠近目标节点
        if(closest) {
            return this.pathTo(closetNode);
        }

        return [];
    },

    setTiles : function (tiles) {
        this.tiles = [];

        for(var x = 0;x < tiles.length;x++){
            for(var y = 0,row = tiles[x];y < row.length;y++){
                var node = new GridNode(x,y,row[y]);
                this.tiles.push(node);
            }
        }
    },

    //返回路径（通过父亲结点）
    pathTo : function(node) {
        var curr = node;
        var path = [];
        while(curr.parent){
            path.unshift(curr);
            curr = curr.parent;
        }
        return path;
    },


/*
 几种估价函数，包括曼哈顿估价，几何估价，对角线估价
 */
    //曼哈顿
    manhattan : function(pos0,pos1) {
        var distance1 = Math.abs(pos1.x - pos0.x);
        var distance2 = Math.abs(pos1.y - pos0.x);
        return distance1 + distance2;
    },

    //几何
    euclidian : function(pos0,pos1) {
        var straightCost = 1;
        var distance1 = Math.abs(pos1.x - pos0.x);
        var distance2 = Math.abs(pos1.y - pos0.x);
        return Math.sqrt(distance1 * distance1 + distance2 * distance2) * straightCost;

    },

    //斜线距离（综合了曼哈顿和几何）
    diagonal : function (pos0,pos1) {
        var distance1 = Math.abs(pos1.x - pos0.x);
        var distance2 = Math.abs(pos1.y - pos0.x);
        var straight = distance1 + distance2;
        var diag = Math.min(distance1,distance2);
        var straightCost = 1;
        var diagCost = Math.sqrt(2);

        return diagCost * diag + straightCost * (straight - 2 * diag);
    },

    neighbors : function (node) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        // West
        if (this.tiles[x - 1] && this.tiles[x - 1][y]) {
            ret.push(this.tiles[x - 1][y]);
        }

        // East
        if (this.tiles[x + 1] && this.tiles[x + 1][y]) {
            ret.push(this.tiles[x + 1][y]);
        }

        // South
        if (this.tiles[x] && this.tiles[x][y - 1]) {
            ret.push(this.tiles[x][y - 1]);
        }

        // North
        if (this.tiles[x] && this.tiles[x][y + 1]) {
            ret.push(this.tiles[x][y + 1]);
        }

        if (this.diagonal) {
            // Southwest
            if (this.tiles[x - 1] && this.tiles[x - 1][y - 1]) {
                ret.push(this.tiles[x - 1][y - 1]);
            }

            // Southeast
            if (this.tiles[x + 1] && this.tiles[x + 1][y - 1]) {
                ret.push(this.tiles[x + 1][y - 1]);
            }

            // Northwest
            if (this.tiles[x - 1] && this.tiles[x - 1][y + 1]) {
                ret.push(this.tiles[x - 1][y + 1]);
            }

            // Northeast
            if (this.tiles[x + 1] && this.tiles[x + 1][y + 1]) {
                ret.push(this.tiles[x + 1][y + 1]);
            }
        }

        return ret;
    },

    //重置结点
    cleanNode : function(node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;

    },

    tiles : null

});

// 方格
var GridNode = cc.Class.extend({
    ctor : function (x,y,weight) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    },

    toString : function () {
        return "[" + this.x + " " + this.y + "]";
    },

    //获取到从邻居结点到自己的权重
    getCost : function (fromNeighbor) {
        if(fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * Math.sqrt(2);
        }
        return this.weight;
    },

    //返回该结点是否可以到达
    isWall : function () {
        return this.weight === 0;
    }

});

// 数据结构（最小堆）
var BinaryHeap = cc.Class.extend({

    ctor : function (scoreFunction) {
        this.scoreFunction = scoreFunction;
        this.content = [];
    },

    // 加入到数组的后面，也就是树的叶节点
    Push : function(element) {
        // 在数组后面加入
        this.content.push(element);
        this.SinkDown(this.content.length - 1);
    },

    // 返回数组的第一个元素，也就是树的根节点
    Pop : function() {
        var result = this.content[0];
        // 返回数组的最后一个元素
        var end = this.content.pop();
        // 将最后一个元素设置为第一个，再进行排序
        if (this.content.length > 0) {
            this.content[0] = end;
            // 重新进行排序
            this.BubbkeUp(0);
        }
        return result;
    },

    // 大小
    Size : function(){
        return this.content.length;
    },

    // 删除
    Romove : function(element){
        var i = this.content.indexOf(element);
        // 获得数组的最后的元素
        var end = this.content.pop();
        if (i !== this.content.length - 1) {
            this[i] = end;
            // 判断删除的节点的值和数组最后的元素
            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.SinkDown(i);
            }
            else {
                this.BubbkeUp(i);
            }
        }
    },

    //重新排序
    RescoreElement : function(element) {
        this.SinkDown(this.content.indexOf(element));
    },

    // 上移
    BubbkeUp : function(n){
        // 计算子节点的位置
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);

        while(1) {
            var child2N = (n + 1)<<1;
            var child1N = child2N - 1;

            var swap = null;
            //如果子节点存在
            if(child1N < length){
                //计算分数
                var child1 = this.content[child1N];
                var child1Score = this.scoreFunction(child1);

                //如果子节点的值小于父亲节点，则需要进行交换
                if(child1Score < elemScore){
                    swap = child1N;
                }
            }
            //同样操作
            if(child2N < length){
                //计算分数
                var child2 = this.content[child1N];
                var child2Score = this.scoreFunction(child2);

                //如果子节点的值小于父亲节点，则需要进行交换
                if(child2Score < (swap === null ? elemScore : child1Score)){
                    swap = child2N;
                }
            }

            //如果父亲节点需要移动，则进行移动，否则continue
            if (swap !== null) {
                this.content[n] = this[swap];
                this.content[swap] = element;
                n = swap;
            }
            else {
                break;
            }
        }

    },

    // 下移
    SinkDown : function(n){
        var element = this.content[n];
        while(n > 0) {
            // 父结点的位置
            var parentN = ((n+1) >> 1)-1;
            var parent = this.content[parentN];

            if(this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;

                n = parentN;
            }
            else {
                break;
            }
        }
    },

    scoreFunction : null,
    content       : null,

});


