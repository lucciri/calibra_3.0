
(function ($) {
    $.SearchModal = function (props) {
        var $this = $("#search-results-page, .search-modal");
        var _this = this;
        this.props = props;

        var typingTimer;                //timer identifier
        _this.props.doneTypingInterval = 1000;  //time in ms (1 seconds) before search is performed automatically
        _this.props.minTypingLength = 3;  //min length of search term allowed before doing a search while typing

        // ------------------------------
        // Public Functions
        // ------------------------------
        if (SupportsHistoryApi()) {
            $(window).on("popstate", function (e) {
                if (e.originalEvent.state && e.originalEvent.state.isMine) {
                    DoHistorySearch();
                }
            });
        }

        $this.find("input#searchBarInput").on("keyup", function (e) {
            var term = $(this).val();
            clearTimeout(typingTimer);
            if (term.length > 0) {
                $(this).val(CleanSearchTerm(term));
                typingTimer = setTimeout(DoneTyping, _this.props.doneTypingInterval);
            }

            if (e.which === 13 || e.keyCode === 13) {
                clearTimeout(typingTimer);
                DoSearch();
            }
        });

        $this.find("a.input-search-btn").on("click", function (e) {
            e.preventDefault();
            DoSearch();
        });

        this.UsersPageClick = function (page) {
            var term = $("input#searchBarInput").val();
            if ((typeof term !== "undefined") && (term !== "")) {
                LoadUsers(term, page, true);
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    "Page": page,
                    "event": "SearchModalUserPage"
                });
            }
        };

        this.BlogsPageClick = function (page) {
            var term = $("input#searchBarInput").val();
            if ((typeof term !== "undefined") && (term !== "")) {
                LoadBlogs(term, page, true);
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    "Page": page,
                    "event": "SearchModalBlogPage"
                });
            }
        }

        this.ContentPageClick = function (page) {
            var term = $("input#searchBarInput").val();
            if ((typeof term !== "undefined") && (term !== "")) {
                //if (!IsScrolledIntoView("#searchBarInput")) {
                //    $("html, body").animate({
                //        scrollTop: 0
                //    }, 100);
                //}

                LoadContent(term, page, true);
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    "Page": page,
                    "event": "SearchModalContentPage"
                });
            }
        };

        this.SearchTerm = function (term) {
            if ((typeof term !== "undefined") && (term !== "")) {
                var siteSearch = $this.find("input#searchBarInput");
                siteSearch.val(term);
                DoSearch();
            }
        }

        // ------------------------------
        // Private Functions
        // ------------------------------
        var DoneTyping = function () {
            var term = $this.find("input#searchBarInput").val();
            if (term.length >= _this.props.minTypingLength) {
                DoSearch();
            }
        };

        var Init = function () {
            var term = urlParams["term"];
            if (typeof term !== "undefined") {
                var siteSearch = $this.find("input#searchBarInput");
                siteSearch.val(CleanSearchTerm(term));
                siteSearch.trigger("focus");
                $('.search-modal').addClass('active');
                $('body').addClass('n5b-noScroll');
                if (term !== "") {
                    DoSearch();
                }
            }
        };

        var DoHistorySearch = function () {
            var returnLocation = history.location || document.location;
            if (returnLocation.href !== "") {
                var params = GetURLParams(returnLocation.href);
                var term = params["term"];

                if ((typeof term !== "undefined") && (term !== "")) {
                    var siteSearch = $this.find("input#searchBarInput");
                    siteSearch.val(term);

                    if (_this.props.site !== "LC") {
                        LoadUsers(term, 0, false);
                    }
                    LoadContent(term, 0, false);
                }
            }
        };

        var DoSearch = function () {
            if (ValidateSearch()) {
                var siteSearch = $this.find("input#searchBarInput");
                var term = siteSearch.val();

                $("#mdl-didyoumean").html("");
                $("#mdl-suggestions").html("");
                $("#search-intro").hide();

                if (SupportsHistoryApi()) {
                    history.pushState({ isMine: true }, "SiteSearch", "?term=" + term);
                }

                if (_this.props.site !== "LC") {
                    
                    LoadUsers(term, 0, false);
                }
                LoadContent(term, 0, false);

                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    "Value": term,
                    "event": "SearchModal"
                });
            }
        };

        var CleanSearchTerm = function (term) {
            if (term && (term.length >= 1)) {
                return term.replace(/[|;@"<>()+,]/g, "");
            }
            return "";
        }

        var ValidateSearch = function () {
            var siteSearch = $("input#searchBarInput");
            var term = siteSearch.val();

            if (term.length <= 1) {
                return false; // Search should be more than 1 character
            }
            else {
                if (term.indexOf('<') !== -1 || term.indexOf('>') !== -1) {
                    siteSearch.val(CleanSearchTerm(term));
                    return false;
                }
                return true;
            }
        };

        var LoadUsers = function (term, page, isClickEvent) {
            var users = new Users();
            users.Load(term, page, isClickEvent);
        };

        var LoadContent = function (term, page, isClickEvent) {
            var content = new Content();
            content.Load(term, page, isClickEvent);
        };

        var ScrollIntoView = function (obj) {
            // Weird behaviour in the modal and the flex objects, not sure what the offset is returning.
            //var pos = obj.offset().top - $('.search-bar-wrap').height();
            //$(".search-modal").animate({
            //    scrollTop: pos
            //}, 100);
            // This works, but doesn't scroll smoothly. Requires a -1 tabindex on the object
            obj.trigger("focus");
        };

        var BuildPaging = function (id, onclick_func, page_count, page_size, current_page) {
            var paging_html = "";
            var buttonCount = 3
            // check to see if we have any data to set up paging'
           
            if (page_count > 1) {
                current_page = current_page - 1;

                // only build the paging if we have more than one page of items to show
                if (page_count > 1) {
                    paging_html = "<ul>";
                    var prevClick = current_page > 0 ? "onclick=\"" + onclick_func + "(" + (current_page) + ");\"" : "";
                    paging_html += "<li><a href=\"javascript:void(0);\" " + prevClick + " class=\"" + (current_page === 0 ? "disabled" : "") + "\">Previous</a></li>";
                    for (var i = 0; i < page_count; i++) {
                        // display the first, last page, and 5 pages around the current page number
                        if ((i === 0) || (i === page_count - 1) || ((i >= current_page - (buttonCount - 1)) && (i <= current_page + (buttonCount - 1)))) {
                            var page_num = i + 1;
                            if (i === 0) {
                                
                            }
                            if (i === current_page) {   // highlight the page we're on
                                paging_html += "<li ><a href=\"javascript:void(0);\" class=\"current\">" + page_num + "</a></li>";
                            }
                            else {
                                paging_html += "<li>";
                                paging_html += "<a href=\"javascript:void(0);\" onclick=\"" + onclick_func + "(" + page_num + ");\">" + page_num + "</a></li>";
                            }
                        }
                        else if ((i === current_page - buttonCount) || (i === current_page + buttonCount)) {
                            paging_html += "<li>...</li>";
                        }
                    }
                    var nextClick = current_page < page_count - 1 ? "onclick=\"" + onclick_func + "(" + (current_page + 2) + ");\"" : "";
                    paging_html += "<li><a href=\"javascript:void(0);\" " + nextClick + " class=\"" + (current_page === page_count-1 ? "disabled" : "") + "\">Next</a></li>";
                    paging_html += "</ul>";
                }
            }

            $("#" + id).html(paging_html);
        };

        // ------------------------------
        // Users Object
        // ------------------------------
        var Users = function () {
            var timer = 0;

            // Public Functions
            this.Load = function (term, page, isClickEvent) {
                BeginRequest();

                $("#users-paginator").hide();

                $.post("/handlers/search/",
                    { "action": "users", "term": term, "page": page, "site": _this.props.site },
                    function (data) {
                        EndRequest();
                        ProcessResults(data, isClickEvent);
                    }
                );
            };

            // Private Functions
            var ProcessResults = function (data, isClickEvent) {
                var json = JSON.parse(data);

                $("#mdl-user-search-results").empty();
      
                if ((typeof json.error !== "undefined") || (json.length === 0)) {
                    $("#mdl-people-container").hide();
                    $("#mdl-users-pages").empty();
                    return;
                }

                if ((typeof json.userList === "undefined") || (json.userList.length === 0)) {
                    $("#mdl-people-container").hide();
                    $("#mdl-users-pages").empty();
                    return;
                }

                $("#mdl-people-container").show();

                var source = $("#modalUserTemplate").html();
                var template = Handlebars.compile(source);
                var html = template(json);

                $("#mdl-user-search-results").html(html);

                if (json.totalPages > 1) {
                    $("#mdl-users-pages").show();
                    BuildPaging("mdl-users-pages", "modalSearch.UsersPageClick", json.totalPages, json.itemsPerPage, json.currentPage);
                } else {
                    $("#mdl-users-pages").empty();
                }

                var elem = $("#mdl-people-title");
                if (!IsScrolledIntoView(elem) && isClickEvent) {
                    ScrollIntoView(elem);
                }
            };

            var BeginRequest = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }

                timer = setTimeout(function () { ShowLoading(); }, 1000);
            }

            var EndRequest = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }

                $("#mdl-users-loading").hide();
            };

            var ShowLoading = function () {
                $("#mdl-users-loading").show();
            };
        };


        // ------------------------------
        // Content Object
        // ------------------------------
        var Content = function () {
            var timer = 0;

            // Public Functions
            this.Load = function (term, page, isClickEvent) {
                BeginRequest();

                $("#mdl-content-search-results").empty();

                $.post("https://www.svb.com/handlers/search/",
                    { "action": "content", "term": term, "page": page, "site": _this.props.site },
                    function (data) {
                        EndRequest();
                        ProcessResults(data, term, isClickEvent);
                        EnableSpeedBumpLinks();
                    }
                );
            };

            // Private Functions
            var ProcessResults = function (data, term, isClickEvent) {
                var json = JSON.parse(data);

                if ((typeof json.error !== "undefined") || (json.length === 0)) {
                    $("#mdl-content-pages").empty();
                    return;
                }

                if ((typeof json.contentList === "undefined") || (json.contentList.length === 0)) {
                    $("#mdl-content-search-results").html("No results found.");
                    if (typeof Spellcheck !== "undefined") {
                        Spellcheck(term);
                    }
                    return;
                }

                var contentSource = $("#modalContentTemplate").html();
                var contentTemplate = Handlebars.compile(contentSource);
                var contentHtml = contentTemplate(json);
                $("#mdl-content-search-results").html(contentHtml);

                if (typeof RelatedQuery !== "undefined") {
                    RelatedQuery(term);
                }

                if (json.totalPages > 1) {
                    $("#mdl-content-pages").show();
                    BuildPaging("mdl-content-pages", "modalSearch.ContentPageClick", json.totalPages, json.itemsPerPage, json.currentPage);
                } else {
                    $("#mdl-content-pages").empty();
                }

                var elem = $("#mdl-didyoumean");
                if (!IsScrolledIntoView(elem) && isClickEvent) {
                    ScrollIntoView(elem);
                }
            };

            var BeginRequest = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                
                timer = setTimeout(function () { ShowLoading(); }, 1000);
            };

            var EndRequest = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                $("#mdl-content-loading").hide();
            };

            var ShowLoading = function () {
                $("#mdl-content-loading").show();
            };
        };

        Init();
    };
})(jQuery);