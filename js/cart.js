class Cart {
    constructor() {
        if (localStorage.getItem("cartDatas")) {
            this.cartDatas = JSON.parse(localStorage.getItem("cartDatas"));
        } else {
            this.cartDatas = {};
        }
    }
    saveData(id, num, terminal) { //terminal是一个标识，true为最终值
        if (!this.cartDatas[id] || terminal) {
            this.cartDatas[id] = num;
        } else {
            this.cartDatas[id] += num;
        }
        localStorage.setItem("cartDatas", JSON.stringify(this.cartDatas));
    }
    showList(id) {
        this.oCartList = document.getElementById(id);
        let productDatas = JSON.parse(localStorage.getItem("productDatas"));
        let str = "";
        for (let id in this.cartDatas) {
            str += `<li class="list" data-id="${id}">
            <input type="checkbox" class="ck">
            <img src="${productDatas[id].imgsrc}">
            <span>${productDatas[id].title}</span>
            <span class="minus">-</span>
            <input type="text" value="${this.cartDatas[id]}" class="num">
            <span class="plus">+</span>
            <span class="perP">${productDatas[id].price}</span>
            <span class="perTp">${productDatas[id].price * this.cartDatas[id]}</span>
            <span class="delBtn">删除</span>
            </li>`;
        }
        this.oCartList.innerHTML = str;
        //添加功能
        let oCheckAll = document.getElementById("checkAll"); //取到全选复选框
        this.aCk = document.querySelectorAll(".ck"); //所有的单个复选框
        this.list = document.querySelectorAll(".list");
        this.aMinus = document.querySelectorAll(".minus");
        this.aNums = document.querySelectorAll(".num");
        this.aPlus = document.querySelectorAll(".plus");
        this.aPerPs = document.querySelectorAll(".perP");
        this.aPerTps = document.querySelectorAll(".perTp");
        this.aDelBtns = document.querySelectorAll(".delBtn");
        this.totalPrice = document.getElementById("totalPrice");
        //1.全选
        //1.1 点击全选复选框，让单个复选框全部选中
        oCheckAll.onclick = () => {
            for (let i = 0; i < this.aCk.length; i++) {
                this.aCk[i].checked = oCheckAll.checked;
            }
            this.getTotalPrice();
        }
        //1.2 点击单个复选框，如果选中的复选框和所有的复选框的数量相等，全选复选框选中，否则取消选中
        for (let i = 0; i < this.aCk.length; i++) {
            this.aCk[i].onclick = () => {
                let count = 0; //计数，选中的数量
                for (let j = 0; j < this.aCk.length; j++) {
                    if (this.aCk[j].checked) {
                        count++;
                    }
                }
                if (count == this.aCk.length) {
                    oCheckAll.checked = true;
                } else {
                    oCheckAll.checked = false;
                }
                this.getTotalPrice();
            }
        }
        //2 修改数据 在购物车页面里只要改了商品数量，就要立即保存 
        //在购物车页面的商品数量是最终值，而在列表页和详情页的商品数量为累加值
        for (let i = 0; i < this.aMinus.length; i++) {
            this.aMinus[i].onclick = () => {
                this.aNums[i].value--;
                if (this.aNums[i].value <= 0) {
                    this.aNums[i].value = 1;
                }
                this.changePrice(i);

            }
            this.aPlus[i].onclick = () => {
                this.aNums[i].value++;
                this.changePrice(i);

            }
            this.aNums[i].onchange = () => {
                if (this.aNums[i].value <= 0) {
                    this.aNums[i].value = 1;
                }
                this.changePrice(i);
            }
            this.aDelBtns[i].onclick = () => {
                //删数据和结构
                let id = this.list[i].getAttribute("data-id");
                this.delData(id, i);
            }
        }

    }
    changePrice(i) {
        let id = this.list[i].getAttribute("data-id");
        this.saveData(id, +this.aNums[i].value, true); //存数据
        this.aPerTps[i].innerText = this.aNums[i].value * this.aPerPs[i].innerText;
        this.getTotalPrice();
    }
    getTotalPrice() {
        //计算总价
        let sum = 0;
        for (let i = 0; i < this.aCk.length; i++) {
            if (this.aCk[i].checked) {
                sum += +this.aPerTps[i].innerText; //把所有单个复选框选中的商品对应单个总价求和
            }
        }

        this.totalPrice.innerText = sum;
    }
    delData(id, i) {
        //删数据
        delete this.cartDatas[id];
        localStorage.setItem("cartDatas", JSON.stringify(this.cartDatas));

        //删结构
        this.oCartList.removeChild(this.aDelBtns[i].parentNode); //使用query这种方式获取的结构，通过removeChild删除之后，集合的长度并没有发生改变
        //计算总价
        this.aCk[i].checked = false; //既然没有发生改变，在getTotalPrice里计算总价时，还会算上。怎么算的呢？看单个复选框是否选中。所有既然删了，不要取计算删除的商品的价格，就把当前删除的商品前的复选框置为false，就不会再计算了
        this.getTotalPrice();

    }
}