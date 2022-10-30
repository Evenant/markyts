"use strict";
/// This file is the entry point to the markdown parser library
/// Built specifically for AlpineMD
exports.__esModule = true;
exports.Marky = void 0;
/// `MarkType` is an enum that defines what a `Mark` object should be.
/// A Default `Mark` is the base for processing Markdown plain text
var MarkType;
(function (MarkType) {
    MarkType[MarkType["Default"] = 0] = "Default";
    MarkType[MarkType["Header"] = 1] = "Header";
    MarkType[MarkType["Strikethrough"] = 2] = "Strikethrough";
    MarkType[MarkType["Bold"] = 3] = "Bold";
    MarkType[MarkType["Italic"] = 4] = "Italic";
    MarkType[MarkType["UnorderedList"] = 5] = "UnorderedList";
    MarkType[MarkType["OrderedList"] = 6] = "OrderedList";
    MarkType[MarkType["Hyperlink"] = 7] = "Hyperlink";
    MarkType[MarkType["Image"] = 8] = "Image";
    MarkType[MarkType["Table"] = 9] = "Table";
    MarkType[MarkType["CheckList"] = 10] = "CheckList";
    MarkType[MarkType["InlineCode"] = 11] = "InlineCode";
    MarkType[MarkType["BlockCode"] = 12] = "BlockCode"; ///c
})(MarkType || (MarkType = {})); ///c
/// Learning Regex was a nightmare, but also oddly satisfying.
/// The only thing missing here is a table regex.
/// I personally do not have a use for tables, so its not a big deal.
/// to test these regex values go to (Regexr)[https://regexr.com] and copy paste the following:
/// (^#{1,6}\s{1}[\s\S]+?\n)|(\*{2}[\s\S]+\*{2})|(\*{1}[s\S]+\*{1})|(~{2}[\s\S]+~{2})|(`{3}[\s\S]+?`{3})|(`{1}[\s\S]+`{1})|(\([\s\S]+?\])|(\![\s\S]+?\])|(\t*-{1}\s{1}[\s\S]+?\n{1})|(\t*\d{1}\.{1}\s{1}[\s\S]+?\n{1})|(\t*-{1}\s{1}[\sx\[\]]+(?:\s{1}[\s\S]+?\n{1}))
/// Set the flags to multiline and global and type some Markdown stuff.
var MarkdownRegex = {
    BlockCode: /(`{3}[\s\S]+?`{3})/m,
    Image: /(\![\s\S]+?\])/,
    Hyperlink: /(\([\s\S]+?\])/,
    Header: /(^#{1,6}\s{1}[\s\S]+?\n)/,
    CheckList: /(\t*-{1}\s{1}[\sx\[\]]+(?:\s{1}[\s\S]+?\n{1}))/,
    UnorderedListElem: /(\t*-{1}\s{1}[\s\S]+?\n{1})/,
    OrderedListElem: /(\t*(\d{1,}\.{1})+\s{1}[\s\S]+?\n{1})/,
    Bold: /(\*{2}[\s\S]+\*{2})/,
    Italic: /(\*{1}[s\S]+\*{1})/,
    Strikethrough: /(~{2}[\s\S]+~{2})/,
    InlineCode: /(`{1}[\s\S]+`{1})/
}; ///c
function SearchText(Text) {
    var RetArray = {
        BlockCode: Text.search(MarkdownRegex.BlockCode),
        Image: Text.search(MarkdownRegex.Image),
        Hyperlink: Text.search(MarkdownRegex.Hyperlink),
        Header: Text.search(MarkdownRegex.Header),
        CheckList: Text.search(MarkdownRegex.CheckList),
        UnorderedListElem: Text.search(MarkdownRegex.UnorderedListElem),
        OrderedListElem: Text.search(MarkdownRegex.OrderedListElem),
        Bold: Text.search(MarkdownRegex.Bold),
        Italic: Text.search(MarkdownRegex.Italic),
        Strikethrough: Text.search(MarkdownRegex.Strikethrough),
        InlineCode: Text.search(MarkdownRegex.InlineCode)
    };
    return RetArray;
}
function MarkyBlockCode(Text) {
    if (Text == null)
        return "";
    while (Text[0] == "`") {
        Text = Text.slice(1, -1);
    }
    while (Text[-1] == "`") {
        Text = Text.slice(0, -2);
    }
    return "<code>" + Text + "</code>";
}
function MarkyBold(Text) {
    while (Text[0] == "*" || Text[0] == " ") {
        Text = Text.slice(1, -1);
    }
    while (Text[-1] == "*" || Text[-1] == " ") {
        Text = Text.slice(0, -2);
    }
    return "<strong>" + Text + "</strong>";
}
function MarkyHeader(Text) {
    while (Text[0] == "#" || Text[0] == " ") {
        Text = Text.slice(1);
    }
    Text = Text.slice(0, -1);
    var IdText = Text.toLowerCase();
    IdText = IdText.replace(/\s/g, "-");
    IdText = IdText.replace(/\*/g, "");
    IdText = IdText.replace(/~/g, "");
    IdText = IdText.replace(/`/g, "");
    return "<h1 id=\"" + IdText + "\"" + " >" + Marky(Text) + "</h1>";
}
function MarkyCheckList(Text) {
    while (Text[0] == "-" || Text[0] == " ") {
        Text = Text.slice(1);
    }
    var IsChecked = false;
    if (Text[1] == "x") {
        IsChecked = true;
    }
    Text = Text.slice(3);
    var CheckListId = Text.toLowerCase().replace(" ", "-");
    var Ret = "<label for=\"" + CheckListId + "\"" + ">" + Text + "</label>" + "<input id=\"" + CheckListId + "\" type=\"checkbox\" onclick=\"return false;\" ";
    if (IsChecked == true)
        Ret += "checked";
    Ret += "/>" + "<br/>";
    return Ret;
}
function MarkyHyperlink(Text) {
    Text = Text.slice(1);
    Text = Text.slice(0, -1);
    Text = Text.replace(")[", " ");
    return "<a href=\"" + Text.split(" ")[1] + "\"" + ">" + Text.split(" ")[0] + "</a>";
}
function MarkyImage(Text) {
    Text = Text.slice(2);
    Text = Text.slice(0, -1);
    Text = Text.replace(")[", " ");
    return "<img src=\"" + Text.split(" ")[1] + "\"" + " alt=\"" + Text.split(" ")[0] + "\"/>";
}
// TODO fill these functions in to make them process  markdown elements
function MarkyInlineCode(Text) {
    while (Text[0] == "`" || Text[0] == " ") {
        Text = Text.slice(1, -1);
    }
    while (Text[-1] == "`" || Text[-1] == " ") {
        Text = Text.slice(0, -1);
    }
    return "<code>" + Text + "</code>";
}
function MarkyItalic(Text) {
    while (Text[0] == "*" || Text[0] == " ") {
        Text = Text.slice(1, -1);
    }
    while (Text[-1] == "*" || Text[-1] == " ") {
        Text = Text.slice(0, -1);
    }
    return "<i>" + Text + "</i>";
}
function MarkyOrderedList(Text) {
    var Tabs = 0;
    var SideVal = "";
    while (Text[0] != " ") {
        if (Text[0] == "\t")
            Tabs++;
        else
            SideVal += Text[0];
        Text = Text.slice(1);
    }
    Text = Text.slice(1);
    var Ret = "<div class=\"markdown-ol\"><span class=\"markdown-tab\">";
    while (Tabs != 0) {
        Ret += "::::";
        Tabs--;
    }
    Ret += "</span><span class=\"markdown-ol-marker\">" + SideVal + "</span><span class=\"markdown-ol-content\">" + Text + "</span></div>";
    return Ret;
}
function MarkyStrikethrough(Text) {
    while (Text[0] == "~" || Text[0] == " ") {
        Text = Text.slice(1, -1);
    }
    while (Text[-1] == "~" || Text[-1] == " ") {
        Text = Text.slice(0, -1);
    }
    return "<del>" + Text + "</del>";
}
function MarkyUnorderedList(Text) {
    var Tabs = 0;
    while (Text[0] != " ") {
        if (Text[0] == "\t")
            Tabs++;
        Text = Text.slice(1);
    }
    var Ret = "<div class=\"markdown-ul\"><span class=\"markdown-tab\">";
    while (Tabs != 0) {
        Ret += "::::";
        Tabs--;
    }
    Ret += "</span>> <span class=\"markdown-ul-content\">" + Text + "</span></div>";
    return Ret;
}
function Marky(Text) {
    var NewText = "";
    while (Text.length != 0) {
        console.log(Text);
        var Smallest = Infinity;
        var Type = null;
        var Raw = SearchText(Text);
        var PosBlockCode = Raw.BlockCode;
        var PosBold = Raw.Bold;
        var PosCheckList = Raw.CheckList;
        var PosHeader = Raw.Header;
        var PosHyperlink = Raw.Hyperlink;
        var PosImage = Raw.Image;
        var PosInlineCode = Raw.InlineCode;
        var PosItalic = Raw.Italic;
        var PosOrderedListElem = Raw.OrderedListElem;
        var PosStrikethrough = Raw.Strikethrough;
        var PosUnorderedListElem = Raw.UnorderedListElem;
        if (PosBlockCode < Smallest && PosBlockCode != -1) {
            Smallest = PosBlockCode;
            Type = MarkType.BlockCode;
        }
        if (PosBold < Smallest && PosBold != -1) {
            Smallest = PosBold;
            Type = MarkType.Bold;
        }
        if (PosCheckList < Smallest && PosCheckList != -1) {
            Smallest = PosCheckList;
            Type = MarkType.CheckList;
        }
        if (PosHeader < Smallest && PosHeader != -1) {
            Smallest = PosHeader;
            Type = MarkType.Header;
        }
        if (PosHyperlink < Smallest && PosHyperlink != -1) {
            Smallest = PosHyperlink;
            Type = MarkType.Hyperlink;
        }
        if (PosImage < Smallest && PosImage != -1) {
            Smallest = PosImage;
            Type = MarkType.Image;
        }
        if (PosInlineCode < Smallest && PosInlineCode != -1) {
            Smallest = PosInlineCode;
            Type = MarkType.InlineCode;
        }
        if (PosItalic < Smallest && PosItalic != -1) {
            Smallest = PosItalic;
            Type = MarkType.Italic;
        }
        if (PosOrderedListElem < Smallest && PosOrderedListElem != -1) {
            Smallest = PosOrderedListElem;
            Type = MarkType.OrderedList;
        }
        if (PosStrikethrough < Smallest && PosStrikethrough != -1) {
            Smallest = PosStrikethrough;
            Type = MarkType.Strikethrough;
        }
        if (PosUnorderedListElem < Smallest && PosUnorderedListElem != -1) {
            Smallest = PosUnorderedListElem;
            Type = MarkType.UnorderedList;
        }
        if (Smallest == 0) {
            switch (Type) {
                case MarkType.BlockCode:
                    // @ts-ignore: This throws a "Possibly null" error, but this cannot be null because if there are no BlockCode's, this code wont even execute
                    NewText += MarkyBlockCode(Text.match(MarkdownRegex.BlockCode)[0]);
                    Text = Text.replace(MarkdownRegex.BlockCode, "");
                    break;
                case MarkType.Bold:
                    // @ts-ignore
                    NewText += MarkyBold(Text.match(MarkdownRegex.Bold)[0]);
                    Text = Text.replace(MarkdownRegex.Bold, "");
                    break;
                case MarkType.CheckList:
                    // @ts-ignore
                    NewText += MarkyCheckList(Text.match(MarkdownRegex.CheckList)[0]);
                    Text = Text.replace(MarkdownRegex.CheckList, "");
                    break;
                case MarkType.Header:
                    // @ts-ignore
                    NewText += MarkyHeader(Text.match(MarkdownRegex.Header)[0]);
                    Text = Text.replace(MarkdownRegex.Header, "");
                    break;
                case MarkType.Hyperlink:
                    // @ts-ignore
                    NewText += MarkyHyperlink(Text.match(MarkdownRegex.Hyperlink)[0]);
                    Text = Text.replace(MarkdownRegex.Hyperlink, "");
                    break;
                case MarkType.Image:
                    // @ts-ignore
                    NewText += MarkyImage(Text.match(MarkdownRegex.Image)[0]);
                    Text = Text.replace(MarkdownRegex.Image, "");
                    break;
                case MarkType.InlineCode:
                    // @ts-ignore
                    NewText += MarkyInlineCode(Text.match(MarkdownRegex.InlineCode)[0]);
                    Text = Text.replace(MarkdownRegex.InlineCode, "");
                    break;
                case MarkType.Italic:
                    // @ts-ignore
                    NewText += MarkyItalic(Text.match(MarkdownRegex.Italic)[0]);
                    Text = Text.replace(MarkdownRegex.Italic, "");
                    break;
                case MarkType.OrderedList:
                    // @ts-ignore
                    NewText += MarkyOrderedList(Text.match(MarkdownRegex.OrderedListElem)[0]);
                    Text = Text.replace(MarkdownRegex.OrderedListElem, "");
                    break;
                case MarkType.Strikethrough:
                    // @ts-ignore
                    NewText += MarkyStrikethrough(Text.match(MarkdownRegex.Strikethrough)[0]);
                    Text = Text.replace(MarkdownRegex.Strikethrough, "");
                    break;
                case MarkType.UnorderedList:
                    // @ts-ignore
                    NewText += MarkyUnorderedList(Text.match(MarkdownRegex.UnorderedListElem)[0]);
                    Text = Text.replace(MarkdownRegex.UnorderedListElem, "");
                    break;
            }
        }
        else {
            NewText += Text[0];
            Text = Text.slice(1, Text.length);
        }
    }
    NewText += "";
    return NewText;
}
exports.Marky = Marky;
