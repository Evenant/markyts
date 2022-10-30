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
var MarkStyleType;
(function(MarkStyleType) {
    MarkStyleType[MarkStyleType["Underline"] = 0] = "Underline";
    MarkStyleType[MarkStyleType["Background"] = 1] = "Background";
    MarkStyleType[MarkStyleType["Foreground"] = 2] = "Foreground";
})(MarkStyleType || (MarkStyleType = {}));
