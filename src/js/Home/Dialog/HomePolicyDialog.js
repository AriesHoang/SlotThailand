var HomePolicyDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        // var bgnew = new ccui.ImageView("bg_mail_full.png", ccui.Widget.PLIST_TEXTURE);
        // bgnew.ignoreContentAdaptWithSize(false);
        // bgnew.setScale9Enabled(true);
        // bgnew.setContentSize(cc.winSize.width, cc.winSize.height);
        // //bgnew.setOpacity(200);
        // this.addChild(bgnew);

        var scrollView = new newui.TableView(cc.size(1120, 600), 1);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setScrollBarEnabled(false);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setAnchorPoint(cc.p(0.5, 0.5));
        scrollView.setPosition(-10, -30);
        this.addChild(scrollView, 1);

        this.scrollView = scrollView;
        this._initLabels();
    },

    _initLabels: function () {
        //var title = MultiLanguage.createLabelTTFFont("MAIL_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        var title = new cc.LabelTTF("ĐIỀU KHOẢN SỬ DỤNG", cc.res.font.Myriad_Pro_Regular, 40);
        //title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, cc.winSize.height / 2 - title.height / 2 - 30);
        this.addChild(title);

        var guideStr =
            "Các Điều khoản và Điều kiện áp dụng và ràng buộc bạn nếu bạn tham gia Tiền Club. Trong các Điều khoản và Điều kiện này:\n"
            + " - \"Tên đăng nhập\" có nghĩa là Tài khoản duy nhất đã được phát hành bởi Tiền Club;\n"
            + " - \"Tài khoản người chơi bị khoá\" có nghĩa là Tài khoản đã bị khóa, đóng hoặc bị loại trừ bởi chúng tôi hoặc bạn;\n"
            + " - \"Tài khoản không hoạt động\" nghĩa là Tài khoản không hoạt động trong thời gian từ 6 tháng trở lên;\n"
            + " - \"Người chơi không hoạt động\" có nghĩa là Người chơi có Tài khoản Không hoạt động;\n"
            + " - \"Tham gia\" nghĩa là bất kỳ hành vi nào được mô tả trong 4.1.1 đến 4.1.7 bên dưới và truy cập vào Website Tiền Club và hoặc chơi bất kỳ trò chơi nào được cung cấp bởi Tiền Club;\n"
            + " - \"Người chơi\" nghĩa là người chơi thực sự hoặc một người chơi không hoạt động và hoặc một người chơi đóng tài khoản;\n"
            + " - \"Người chơi Thực sự\" có nghĩa là Người chơi đang tham gia chơi game tại Tiền Club;\n"
            + " - \"Thẩm quyền của bạn\" có nghĩa là thẩm quyền ở nơi bạn đang cư trú, sinh sống hoặc làm việc.\n"
            + "1. Tham gia Chơi game\n"
            + "1.1. Tham gia Tiền Club\n"
            + "1.1.1. Sự tham gia Tiền Club là tùy chọn duy nhất của bạn, tùy ý và chấp nhận rủi ro.\n"
            + "1.1.2. Bạn hoàn toàn chịu trách nhiệm xác định quyền hạn hợp pháp của mình khi tham gia Tiền Club.\n"
            + "1.1.3. Bạn chỉ có thể tham gia tại Tiền Club khi được cho là hợp pháp trong phạm vi quyền hạn của bạn.\n"
            + "1.1.4. Ngoài các điều khoản trong mục 1.1.3 nêu trên, bạn chỉ có thể tham gia tại Tiền Club nếu bạn đã đạt được độ tuổi hợp pháp đa số trong phạm vi Quyền hạn của bạn.\n"
            + "1.1.5. Chúng tôi không bảo đảm sự hợp pháp của việc bạn tham gia tại Tiền CLub về các luật trong thẩm quyền của bạn.\n"
            + "1.1.6. Bạn đồng ý rằng chúng tôi có thể sử dụng thông tin cá nhân do bạn cung cấp để tiến hành kiểm tra chống lừa đảo. Thông tin cá nhân mà bạn cung cấp có thể được tiết lộ cho cơ quan chống tham nhũng hoặc cơ quan chống gian lận. Các cơ quan có thể, theo quyết định của mình và theo các chính sách của mình, lưu giữ hồ sơ thích hợp của thông tin đó.\n"
            + "1.2. Sự đảm bảo\n"
            + "1.2.1. Bạn bảo đảm và chúng tôi ký kết Thỏa thuận này trên cơ sở những tuyên bố và đảm bảo đó, rằng bạn:\n"
            + "1.2.1.1. Có thể hợp pháp tham gia vào Tiền Club trong Thẩm quyền của bạn;\n"
            + "1.2.1.2. là \"người trưởng thành\", đã đạt được độ tuổi trong phạm vi thẩm quyền của bạn;\n"
            + "1.2.1.3. đã cung cấp cho chúng tôi các chi tiết cá nhân, chính xác và đầy đủ và bạn sẽ thông báo cho chúng tôi ngay lập tức qua số hotline nếu các chi tiết đó thay đổi;\n"
            + "1.2.1.4. đã đọc và hiểu các điều khoản, điều kiện này.\n"
            + "1.3. Từ chối đăng ký, huỷ bỏ đăng ký, loại trừ và tạm ngừng.\n"
            + "1.3.1. Bạn xác nhận rằng Tiền Club không bắt buộc thông báo trước về quyết định từ chối, huỷ bỏ đăng ký hoặc loại trừ hoặc tạm ngưng bạn, cũng như cung cấp cho bạn bất kỳ lý do nào cho quyết định đó.\n"
            + "1.3.2. Nếu nhận ra một người chơi chưa đủ tuổi, chúng tôi sẽ, trừ khi có cơ sở chứng tỏ rằng đã có hành vi gian lận:\n"
            + "1.3.2.1. Tạm ngưng tài khoản ngay;\n"
            + "1.3.2.2. Vô hiệu tất cả các phiên chơi đã diễn ra;\n"
            + "1.3.2.3. Đóng tài khoản.\n"
            + "1.4. Công khai\n"
            + "1.4.1. Nếu bạn đang chơi tại Tiền Club, bạn sẽ thắng được một khoản thưởng hoặc bất kỳ giải thưởng nào khác được coi là sự công khai của Tiền Club, bạn đồng ý cho bất kỳ sự kiện nào được sắp xếp bởi Tiền Club để công khai chiến thắng của bạn và bất kỳ giải thưởng tương ứng.\n" +
            "Bạn cho phép Tiền cho phép sử dụng tên, hình ảnh và nội dung của bất kỳ cuộc phỏng vấn nào liên quan đến chiến thắng của bạn. Hơn nữa, bạn từ bỏ tất cả các quyền trong bất kỳ tài liệu nào và đồng ý rằng tất cả các quyền trong các tài liệu đó sẽ thuộc về Tiền Club.\n" +
            "Chúng tôi sẽ cố gắng hết sức để bảo vệ sự riêng tư của bạn mọi lúc\n"
            + "2. Bồi thường & Trách nhiệm\n"
            + "2.1. Bạn phải bồi thường cho Tiền Club tất cả chi phí, thiệt hại (dù là trực tiếp, gián tiếp, đặc biệt, hậu quả, gương mẫu hoặc trừng phạt hoặc khác) phát sinh từ bất kỳ sự tham gia nào của bạn tại Tiền Club. Bản chất của sự tham gia của bạn sẽ bao gồm, nhưng không giới hạn ở, ngoài các yếu tố sau:\n"
            + "2.1.1. Truy cập, sử dụng hoặc tái sử dụng Website Tiền Club;\n"
            + "2.1.2. Nhập, sử dụng hoặc tái sử dụng dịch vụ Website Tiền Club;\n"
            + "2.1.3 Tạo điều kiện hoặc gửi Tiền vào tài khoản của bạn tại Lộc Club;\n"
            + "2.1.4. Tham gia chơi game tại Lộc Club;\n"
            + "2.1.5. Chấp nhận và sử dụng bất kỳ chiến thắng, giải thưởng nào tại hoặc từ Lộc Club;\n"
            + "3. Khuyến mãi & Cuộc thi\n"
            + "3.1. Lộc Club sẽ, đôi khi, cung cấp các chương trình khuyến mại và các cuộc thi đấu nhất định và các cuộc thi và chương trình khuyến mãi này có thể có các điều khoản, điều kiện và quy tắc riêng biệt có tính cạnh tranh hoặc quảng cáo cụ thể.\n"
            + "3.2. Các Điều khoản và Điều kiện áp dụng cho bất kỳ Cuộc thi hoặc khuyến mãi nào.\n"
            + "4. Luật chơi\n"
            + "4.1. Ngoài các Điều khoản và Điều kiện này, Luật chơi nhất định sẽ áp dụng cho bạn và ràng buộc bạn về sự tham gia của bạn tại Lộc Club.\n"
            + "4.2. Bằng cách đồng ý Điều khoản và điều kiện này có nghĩa rằng bạn bị ràng buộc bởi quy tắc nói trên.\n"
            + "5. Sở hữu trí tuệ\n"
            + "5.1. Chúng tôi cấp cho bạn quyền được huỷ bỏ, không độc quyền và không thể chuyển nhượng được sử dụng Trang web Lộc Club, Phần mềm và tất cả nội dung có nguồn gốc từ Website Lộc Club, bao gồm bản quyền và tất cả quyền sở hữu trí tuệ trong đó liên quan đến Dịch vụ trong phù hợp với các Điều khoản và Điều kiện này.\n"
            + "5.2. Bạn thừa nhận và đồng ý rằng tất cả các bản quyền, nhãn hiệu và tất cả các quyền sở hữu trí tuệ khác trong tất cả các tài liệu hoặc nội dung được cung cấp như là một phần của Website Lộc Club và Phần mềm vẫn được giữ nguyên theo nhà cấp phép của chúng tôi. Bạn chỉ được phép sử dụng tài liệu này khi được chúng tôi hoặc nhà cấp phép của chúng tôi cho phép rõ ràng.\n"
            + "6. Mobile Lộc Club\n"
            + "Khi chơi trên Mobile Lộc Club, các điều khoản bổ sung sau đây sẽ được áp dụng:\n"
            + "6.1. Nhà khai thác mạng và các khoản phí khác\n"
            + "Bạn phải tự chịu trách nhiệm cho bất kỳ kết nối, sử dụng hoặc các khoản phí khác do nhà khai thác mạng tính khi bạn đăng ký để chơi các trò chơi, tải Phần Mềm liên lạc với chúng tôi. Những khoản phí này sẽ không phải là một phần của bất kỳ đặt cược nào.\n"
            + "6.2. Virus và bảo toàn dữ liệu\n"
            + "Lộc Club, nhà cung cấp dịch vụ mạng, đối tác, đại diện hoặc nhân viên nào đảm bảo rằng Phần mềm Lộc Club sẽ không có virut hoặc các mã khác gây ô nhiễm hoặc phá hoại và bạn chịu trách nhiệm triển khai và duy trì các thủ tục đủ để đáp ứng các yêu cầu cụ thể của bạn về tính chính xác của dữ liệu đầu vào và đầu ra cũng như bảo vệ khỏi các virus hoặc các mã khác có thể gây ô nhiễm hoặc phá hủy điện thoại, hệ thống hoặc dữ liệu điện thoại di động của bạn.\n" +
            "Lộc Club, nhà cung cấp dịch vụ mạng, đối tác, đại diện hoặc nhân viên không bảo đảm rằng Lộc Club không có lỗi hoặc sẽ hoạt động mà không bị mất hoặc gián đoạn gói tin, và Lộc Club cũng không đảm bảo bất kỳ kết nối hoặc Internet nào.\n"
            + "Tuyệt đối không sử dụng bất kỳ chương trình, công cụ, hay hình thức khác để can thiệp vào trò chơi hay làm thay đổi kết quả chơi bình thường (hack, cheat, bots…). Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi đối với trò chơi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.\n"
            + "Không được có bất kỳ hành vi nào nhằm đăng nhập trái phép hoặc tìm cách đăng nhập trái phép cũng như gây thiệt hại cho hệ thống máy chủ của trò chơi. Mọi hành vi này đều bị xem là những hành vi phá hoại tài sản của người khác và sẽ bị tước bỏ mọi quyền lợi đồi với trò chơi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.\n"
            + "7. Tổng quan\n"
            + "7.1. Sửa đổi\n"
            + "7.1.1. Lộc Club có thể, không cần thông báo cho bạn, sửa đổi, thay đổi, xóa, nối tiếp hoặc thêm vào (\"Thay đổi\") Các Điều Khoản và Điều Kiện này, Các Điều Khoản và Điều Kiện Đặc Biệt hoặc các Điều Khoản và Điều Kiện Đặc Biệt của Cuộc Thi bất kỳ lúc nào.\n"
            + "7.1.2. Những thay đổi này sẽ có hiệu lực, và bạn sẽ bị ràng buộc bởi những thay đổi này, ngay lập tức khi đăng trên Website của Lộc Club.\n"
            + "7.2. Điều kiện tham gia\n"
            + "Các nhân viên của Lộc Club với bất kỳ chương trình giới thiệu nào liên quan đến Lộc Club, quảng cáo hoặc các cơ quan khác, người được cấp phép, người cấp phép, hoặc trong trường hợp cá nhân, gia đình trực tiếp của những cá nhân đó không đủ điều kiện để tham gia tại Lộc Club như một Người chơi Thực sự.\n"
            + "7.3. Bên thứ ba\n"
            + "Trừ khi có quy định khác rõ ràng, không có điều khoản nào trong Các Điều khoản và Điều kiện này tạo ra hoặc trao quyền cho bất kỳ người nào không tham gia vào các Điều khoản và Điều kiện này.\n"
            + "7.4. Chuyển nhượng\n"
            + "Chúng tôi bảo lưu quyền chuyển nhượng, chuyển nhượng, cấp phép lại hoặc cam kết toàn bộ hoặc một phần bất kỳ quyền và nghĩa vụ nào được cấp hoặc áp đặt cho chúng tôi theo các Điều khoản và Điều kiện này. Bạn không thể chuyển nhượng, chuyển nhượng, cấp phép lại hoặc cam kết bất kỳ quyền và nghĩa vụ nào được cấp hoặc áp đặt cho bạn theo các Điều khoản và Điều kiện này.\n"
            + "7.5. Giải thích\n"
            + "Trong Thoả thuận này các tiêu đề được sử dụng chỉ để tiện lợi và sẽ không ảnh hưởng đến việc giải thích của nó. Các tài liệu tham khảo cho mọi người sẽ bao gồm những người được thành lập và không có tư cách pháp nhân; các tham chiếu đến số ít bao gồm số nhiều và ngược lại; và các tài liệu tham khảo về nam giới bao gồm nữ tính.";

        var guidStrNew = "Các điều khoản sử dụng khi ban tham gia vào chương trình của chúng tôi:" +
            "\n1. Điều khoản sử dụng" +
            "\n2. Điều khoản sử dụng";
        var text = new cc.LabelTTF(guidStrNew, cc.res.font.Myriad_Pro_Regular, 27, cc.size(1100, 0));
        this.scrollView.pushItem(text);

        if (cc.winSize.height / cc.winSize.width === 4 / 3 || cc.winSize.height / cc.winSize.width === 3 / 4) {

            this.scrollView.setScale(cc.winSize.screenScale);
            text.setContentSize(this.scrollView.getContentSize().width, this.scrollView.getContentSize().height + 100);
        }
    }
});
