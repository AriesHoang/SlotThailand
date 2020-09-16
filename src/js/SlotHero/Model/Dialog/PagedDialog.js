var SlotHero = SlotHero || {};

(function () {
    var Dialog = SlotHero.Dialog;

    SlotHero.PagedDialog = Dialog.extend({
        ctor: function (width, height) {
            this._super.apply(this, arguments);
            this.currentPage = null;
            this.allPages = [];
            this.enableCircular = true; // circular switching between pages
        },

        /**
         * Init the dialog with a specific size
         * @override
         * @param size {cc.size|Number} position
         * @param y {Number} [posy]
         */
        _initWithSize: function (size, y) {
            arguments[2] = true;
            this._super.apply(this, arguments);

            var pageContainerLayout = new ccui.Layout();
            pageContainerLayout.setClippingEnabled(true);
            pageContainerLayout.setContentSize(this.width - 30, this.height - 30);
            pageContainerLayout.setAnchorPoint(cc.p(0.5, 0.5));
            pageContainerLayout.setPosition(this.width / 2, this.height / 2 + 35);
            this.addChild(pageContainerLayout);
            this.pageContainerLayout = pageContainerLayout;
        },

        initButton: function () {
            this._super.apply(this, arguments);
            //show previous and next page button
            var prevBtn = new ccui.Button("slothero_arrow.png", "slothero_arrow.png", "", ccui.Widget.PLIST_TEXTURE);
            prevBtn.setPosition(prevBtn.width / 2 - 100, this.height / 2);
            this.addChild(prevBtn, 1);

            var nextBtn = new ccui.Button("slothero_arrow.png", "slothero_arrow.png", "", ccui.Widget.PLIST_TEXTURE);
            nextBtn.setPosition(this.width - prevBtn.width / 2 + 100, this.height / 2);
            nextBtn.setFlippedX(true);
            this.addChild(nextBtn, 1);

            var thiz = this;
            prevBtn.addClickEventListener(function () {
                thiz.onPrevBtnClick();
            });

            nextBtn.addClickEventListener(function () {
                thiz.onNextBtnClick();
            });
        },

        onEnter: function () {
            cc.Node.prototype.onEnter.apply(this, arguments); // skip default click handle
        },

        /**
         * Add page to dialog
         * @param {cc.Node} page
         */
        addPage: function (page) {
            this.allPages.push(page);
            this.pageContainerLayout.addChild(page);
            //page.setPosition(page.width / 2, this.pageContainerLayout.height - page.height / 2); // align top left
            page.setPosition(this.pageContainerLayout.width / 2, this.pageContainerLayout.height / 2);
            page.visible = false;
            if (!this.currentPage) {
                this.selectPage(0);
            }
        },

        /**
         * Select and navigate to the page at index
         * @param {Number} index
         */
        selectPage: function (index) {
            if (!this.allPages[index]) // invalid page
                return;

            if (this.currentPage)
                this.currentPage.visible = false;

            this.currentPage = this.allPages[index];
            this.currentPage.visible = true;
        },

        onPrevBtnClick: function () {
            var index = this.allPages.indexOf(this.currentPage) - 1;
            if (this.enableCircular)
                index = this._circularIndex(index);
            this.selectPage(index);
        },

        onNextBtnClick: function () {
            var index = this.allPages.indexOf(this.currentPage) + 1;
            if (this.enableCircular)
                index = this._circularIndex(index);
            this.selectPage(index);
        },

        _circularIndex: function (index) {
            index = index > this.allPages.length - 1 ? (index % this.allPages.length) : index;
            while (index < 0 && this.allPages.length > 0) {
                index += this.allPages.length;
            }
            return index;
        }
    });
})();
