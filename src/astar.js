/**
 * Author: George1994(wangdading)
 * CreateTime: 16/6/21.
 * Description: 实现A星算法
 */

// A星对象
var AStar = {
    // 搜索函数
    SearchPath : function(graph, start, end, options) {
        graph.cleanDirty();

        options = options || {};
        var heuristic = options.heuristic || AStar.manhattan;
        var closest = options.closest || false;

        var openHeap =  new BinaryHeap(function(node) {
            return node.f;
        });

        var closetNode = start;
        start.h = heuristic(start,end);

        //标记开始节点
        graph.markDirty(start);

        openHeap.Push(start);

        // 使用了BFS的队列的思路
        while(openHeap.Size() > 0){
            //取出尾节点
            var currentNode = openHeap.Pop();

            //找到结果
            if(currentNode === end)
                return AStar.pathTo(currentNode);

            //移动节点从开列表到闭列表
            currentNode.closed = true;

            //找出所有邻居节点(4个,如果允许斜线方向则是8个),并分别计算中心结点和邻居结点的h g f值
            var neighbors = graph.neighbors(currentNode);
            for(var i = 0; i < neighbors.length; ++i){
                var neighbor = neighbors[i];

                //闭列表中的和不可到达则不访问
                //if (neighbor.closed) console.log("neigbor (" + neighbor.getX() + "," + neighbor.getY() + ") closed");
                //if (neighbor.isWall()) console.log("neigbor (" + neighbor.getX() + "," + neighbor.getY() + ") is wall");

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
                    neighbor.h = neighbor.h || heuristic(neighbor,end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    graph.markDirty(neighbor);

                    if(closest){
                        // 如果邻居结点比最近的结点更近
                        if (neighbor.h  < closetNode.h || (neighbor.h === closetNode.h && neighbor.g < closetNode.g)) {
                            closetNode = neighbor;
                        }
                    }

                    if(!beenVisited){
                        // 加入堆中,根据结点的f值放在相应的位置
                        openHeap.Push(neighbor);
                    }
                    else{
                        // 重新排序
                        openHeap.RescoreElement(neighbor);
                    }
                }
            }
        }
        //找到靠近目标节点
        if(closest) {
            return AStar.pathTo(closetNode);
        }

        return [];
    },

    /*
     几种估价函数，包括曼哈顿估价，几何估价，对角线估价
     */
    //曼哈顿
    manhattan : function(pos0,pos1) {
        var distance1 = Math.abs(pos1.x - pos0.x);
        var distance2 = Math.abs(pos1.y - pos0.y);
        return distance1 + distance2;
    },

    //几何
    euclidian : function(pos0,pos1) {
        var straightCost = 1;
        var distance1 = Math.abs(pos1.x - pos0.x);
        var distance2 = Math.abs(pos1.y - pos0.y);
        return Math.sqrt(distance1 * distance1 + distance2 * distance2) * straightCost;
    },

    //斜线距离（综合了曼哈顿和几何）
    diagonal : function (pos0,pos1) {
        var distance1 = Math.abs(pos1.x - pos0.x);
        var distance2 = Math.abs(pos1.y - pos0.y);
        var straight = distance1 + distance2;
        var diag = Math.min(distance1, distance2);
        var straightCost = 1;
        var diagCost = Math.sqrt(2);

        return diagCost * diag + straightCost * (straight - 2 * diag);
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

    //返回路径（通过父亲结点）
    pathTo : function (node) {
        var curr = node;
        var path = [];
        while (curr.parent) {
            // 加入数组的头部
            path.unshift(curr);
            curr = curr.parent;
        }
        return path;
    }
};

//一个内存结构
function Graph(gridIn, options){
    options = options || {};
    this.nodes = [];
    this.diagonal = options.diagonal;
    this.grid = [];

    for(var x = 0;x < gridIn.length;x++){
        this.grid[x] = [];

        for(var y = 0,row = gridIn[x];y < row.length;y++){
            var node = new GridNode(x,y,row[y]);
            this.grid[x][y] = node;
            this.nodes.push(node);
        }
    }
    this.init();
};

//初始化
Graph.prototype.init = function(){
    this.dirtyNodes = [];
    for(var i = 0;i < this.nodes.length;i++){
        AStar.cleanNode(this.nodes[i]);
    }
};

//清除节点
Graph.prototype.cleanDirty = function(){
    for(var i = 0;i < this.dirtyNodes.length;i++){
        AStar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

//标记节点
Graph.prototype.markDirty = function (node) {
    this.dirtyNodes.push(node);
};

// 获取到结点的所有邻居结点
Graph.prototype.neighbors = function(node) {
    var ret = [];
    var x = node.x;
    var y = node.y;
    var grid = this.grid;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
        ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
        ret.push(grid[x][y + 1]);
    }

    if (this.diagonal) {
        // Southwest
        if (grid[x - 1] && grid[x - 1][y - 1]) {
            ret.push(grid[x - 1][y - 1]);
        }

        // Southeast
        if (grid[x + 1] && grid[x + 1][y - 1]) {
            ret.push(grid[x + 1][y - 1]);
        }

        // Northwest
        if (grid[x - 1] && grid[x - 1][y + 1]) {
            ret.push(grid[x - 1][y + 1]);
        }

        // Northeast
        if (grid[x + 1] && grid[x + 1][y + 1]) {
            ret.push(grid[x + 1][y + 1]);
        }
    }

    return ret;
};

Graph.prototype.toString = function() {
    var graphString = [];
    var nodes = this.grid;
    for (var x = 0; x < nodes.length; x++) {
        var rowDebug = [];
        var row = nodes[x];
        for (var y = 0; y < row.length; y++) {
            rowDebug.push(row[y].weight);
        }
        graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
};

// 方格
function GridNode(x, y, weight) {
    this.x = x;
    this.y = y;
    this.weight = weight;
};

GridNode.prototype = {
    toString : function () {
        return "[" + this.x + " " + this.y + "]";
    },

    // 获取到从邻居结点到自己的权重
    getCost : function (fromNeighbor) {
        if(fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * Math.sqrt(2);
        }
        return this.weight;
    },

    // 返回该结点是否可以到达
    isWall : function () {
        return this.weight === 0;
    },

    getX : function() {
        return this.x;
    },

    getY : function () {
        return this.y
    },
};

// 数据结构（最小堆）
function BinaryHeap (scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {

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
            if (this.scoreFunction(end) < this.scoreFunction(element)) {
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
            // 计算结点的左右子结点
            var child2N = (n + 1)<<1;
            var child1N = child2N - 1;

            var swap = null;
            var child1Score;
            //如果子节点存在
            if(child1N < length){
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);  //返回结点的f值

                //如果左结点f值小于父亲节点的，则需要进行交换
                if(child1Score < elemScore){
                    swap = child1N;
                }
            }
            //同样操作
            if(child2N < length){
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);  //返回结点的f值

                //如果右结点f值小于父亲结点和左结点的最小值，则需要进行交换
                if(child2Score < (swap === null ? elemScore : child1Score)){
                    swap = child2N;
                }
            }

            //如果父亲节点需要移动，则进行移动，否则continue
            if (swap !== null) {
                this.content[n] = this.content[swap];
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
            var parentN = ((n + 1) >> 1)-1;
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

};
