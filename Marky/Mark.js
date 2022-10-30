// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

var MarkType;
(function(MarkType) {
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
    MarkType[MarkType["BlockCode"] = 12] = "BlockCode";
})(MarkType || (MarkType = {}));
const MarkdownRegex = {
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
};
function SearchText(Text) {
    let RetArray = {
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
    while(Text[0] == "`"){
        Text = Text.slice(1, -1);
    }
    while(Text[-1] == "`"){
        Text = Text.slice(0, -2);
    }
    return "<code>" + Marky(Text) + "</code>";
}
function MarkyBold(Text) {
    while(Text[0] == "*" || Text[0] == " "){
        Text = Text.slice(1, -1);
    }
    while(Text[-1] == "*" || Text[-1] == " "){
        Text = Text.slice(0, -2);
    }
    return "<strong>" + Marky(Text) + "</strong>";
}
function MarkyHeader(Text) {
    while(Text[0] == "#" || Text[0] == " "){
        Text = Text.slice(1);
    }
    Text = Text.slice(0, -1);
    let IdText = Text.toLowerCase();
    IdText = IdText.replace(/\s/g, "-");
    IdText = IdText.replace(/\*/g, "");
    IdText = IdText.replace(/~/g, "");
    IdText = IdText.replace(/`/g, "");
    return "<h1 id=\"" + IdText + "\"" + " >" + Marky(Text) + "</h1>";
}
function MarkyCheckList(Text) {
    while(Text[0] == "-" || Text[0] == " "){
        Text = Text.slice(1);
    }
    let IsChecked = false;
    if (Text[1] == "x") {
        IsChecked = true;
    }
    Text = Text.slice(3);
    const CheckListId = Text.toLowerCase().replace(" ", "-");
    let Ret = "<label for=\"" + CheckListId + "\"" + ">" + Marky(Text) + "</label>" + "<input id=\"" + CheckListId + "\" type=\"checkbox\" onclick=\"return false;\" ";
    if (IsChecked == true) Ret += "checked";
    Ret += "/>" + "<br/>";
    return Ret;
}
function MarkyHyperlink(Text) {
    Text = Text.slice(1);
    Text = Text.slice(0, -1);
    Text = Text.replace(")[", " ");
    return "<a href=\"" + Text.split(" ")[1] + "\"" + ">" + Marky(Text.split(" ")[0]) + "</a>";
}
function MarkyImage(Text) {
    Text = Text.slice(2);
    Text = Text.slice(0, -1);
    Text = Text.replace(")[", " ");
    return "<img src=\"" + Text.split(" ")[1] + "\"" + " alt=\"" + Text.split(" ")[0] + "\"/>";
}
function MarkyInlineCode(Text) {
    while(Text[0] == "`" || Text[0] == " "){
        Text = Text.slice(1, -1);
    }
    while(Text[-1] == "`" || Text[-1] == " "){
        Text = Text.slice(0, -1);
    }
    return "<code>" + Marky(Text) + "</code>";
}
function MarkyItalic(Text) {
    while(Text[0] == "*" || Text[0] == " "){
        Text = Text.slice(1, -1);
    }
    while(Text[-1] == "*" || Text[-1] == " "){
        Text = Text.slice(0, -1);
    }
    return "<i>" + Marky(Text) + "</i>";
}
function MarkyOrderedList(Text) {
    let Tabs = 0;
    let SideVal = "";
    while(Text[0] != " "){
        if (Text[0] == "\t") Tabs++;
        else SideVal += Text[0];
        Text = Text.slice(1);
    }
    Text = Text.slice(1);
    let Ret = "<div class=\"markdown-ol\"><span class=\"markdown-tab\">";
    while(Tabs != 0){
        Ret += "> ";
        Tabs--;
    }
    Ret += "</span><span class=\"markdown-ol-marker\">" + SideVal + "</span><span class=\"markdown-ol-content\">" + Marky(Text) + "</span></div>";
    return Ret;
}
function MarkyStrikethrough(Text) {
    while(Text[0] == "~" || Text[0] == " "){
        Text = Text.slice(1, -1);
    }
    while(Text[-1] == "~" || Text[-1] == " "){
        Text = Text.slice(0, -1);
    }
    return "<del>" + Marky(Text) + "</del>";
}
function MarkyUnorderedList(Text) {
    let Tabs = 0;
    while(Text[0] != " "){
        if (Text[0] == "\t") Tabs++;
        Text = Text.slice(1);
    }
    let Ret = "<div class=\"markdown-ul\"><span class=\"markdown-tab\">";
    while(Tabs != 0){
        Ret += "> ";
        Tabs--;
    }
    Ret += "</span>> <span class=\"markdown-ul-content\">" + Marky(Text) + "</span></div>";
    return Ret;
}
function Marky(Text) {
    let NewText = "";
    while(Text.length != 0){
        let Smallest = Infinity;
        let Type = null;
        const Raw = SearchText(Text);
        const PosBlockCode = Raw.BlockCode;
        const PosBold = Raw.Bold;
        const PosCheckList = Raw.CheckList;
        const PosHeader = Raw.Header;
        const PosHyperlink = Raw.Hyperlink;
        const PosImage = Raw.Image;
        const PosInlineCode = Raw.InlineCode;
        const PosItalic = Raw.Italic;
        const PosOrderedListElem = Raw.OrderedListElem;
        const PosStrikethrough = Raw.Strikethrough;
        const PosUnorderedListElem = Raw.UnorderedListElem;
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
            switch(Type){
                case MarkType.BlockCode:
                    NewText += MarkyBlockCode(Text.match(MarkdownRegex.BlockCode)[0]);
                    Text = Text.replace(MarkdownRegex.BlockCode, "");
                    break;
                case MarkType.Bold:
                    NewText += MarkyBold(Text.match(MarkdownRegex.Bold)[0]);
                    Text = Text.replace(MarkdownRegex.Bold, "");
                    break;
                case MarkType.CheckList:
                    NewText += MarkyCheckList(Text.match(MarkdownRegex.CheckList)[0]);
                    Text = Text.replace(MarkdownRegex.CheckList, "");
                    break;
                case MarkType.Header:
                    NewText += MarkyHeader(Text.match(MarkdownRegex.Header)[0]);
                    Text = Text.replace(MarkdownRegex.Header, "");
                    break;
                case MarkType.Hyperlink:
                    NewText += MarkyHyperlink(Text.match(MarkdownRegex.Hyperlink)[0]);
                    Text = Text.replace(MarkdownRegex.Hyperlink, "");
                    break;
                case MarkType.Image:
                    NewText += MarkyImage(Text.match(MarkdownRegex.Image)[0]);
                    Text = Text.replace(MarkdownRegex.Image, "");
                    break;
                case MarkType.InlineCode:
                    NewText += MarkyInlineCode(Text.match(MarkdownRegex.InlineCode)[0]);
                    Text = Text.replace(MarkdownRegex.InlineCode, "");
                    break;
                case MarkType.Italic:
                    NewText += MarkyItalic(Text.match(MarkdownRegex.Italic)[0]);
                    Text = Text.replace(MarkdownRegex.Italic, "");
                    break;
                case MarkType.OrderedList:
                    NewText += MarkyOrderedList(Text.match(MarkdownRegex.OrderedListElem)[0]);
                    Text = Text.replace(MarkdownRegex.OrderedListElem, "");
                    break;
                case MarkType.Strikethrough:
                    NewText += MarkyStrikethrough(Text.match(MarkdownRegex.Strikethrough)[0]);
                    Text = Text.replace(MarkdownRegex.Strikethrough, "");
                    break;
                case MarkType.UnorderedList:
                    NewText += MarkyUnorderedList(Text.match(MarkdownRegex.UnorderedListElem)[0]);
                    Text = Text.replace(MarkdownRegex.UnorderedListElem, "");
                    break;
            }
        } else {
            NewText += Text[0];
            Text = Text.slice(1);
        }
    }
    return NewText;
}
export { Marky as Marky };
