/// This file is the entry point to the markdown parser library
/// Built specifically for AlpineMD

/// `MarkType` is an enum that defines what a `Mark` object should be.
/// A Default `Mark` is the base for processing Markdown plain text

enum MarkType ///c
{ ///c
	Default, ///c
	Header, ///c
	Strikethrough, ///c
	Bold, ///c
	Italic, ///c
	UnorderedList, ///c
	OrderedList, ///c
	Hyperlink, ///c
	Image, ///c
	Table, ///c
	CheckList, ///c
	InlineCode, ///c
	BlockCode ///c
} ///c

interface MarkyT<T> {
	BlockCode:T,
	Image:T,
	Hyperlink:T,
	Header:T,
	CheckList:T,
	UnorderedListElem:T,
	OrderedListElem:T,
	Bold:T,
	Italic:T,
	Strikethrough:T,
	InlineCode:T
}

/// Learning Regex was a nightmare, but also oddly satisfying.
/// The only thing missing here is a table regex.
/// I personally do not have a use for tables, so its not a big deal.
/// to test these regex values go to (Regexr)[https://regexr.com] and copy paste the following:
/// (^#{1,6}\s{1}[\s\S]+?\n)|(\*{2}[\s\S]+\*{2})|(\*{1}[s\S]+\*{1})|(~{2}[\s\S]+~{2})|(`{3}[\s\S]+?`{3})|(`{1}[\s\S]+`{1})|(\([\s\S]+?\])|(\![\s\S]+?\])|(\t*-{1}\s{1}[\s\S]+?\n{1})|(\t*\d{1}\.{1}\s{1}[\s\S]+?\n{1})|(\t*-{1}\s{1}[\sx\[\]]+(?:\s{1}[\s\S]+?\n{1}))
/// Set the flags to multiline and global and type some Markdown stuff.
const MarkdownRegex:MarkyT<RegExp> = { ///c
	BlockCode : /(`{3}[\s\S]+?`{3})/m, ///c
	Image : /(\![\s\S]+?\])/, ///c
	Hyperlink : /(\([\s\S]+?\])/, ///c
	Header : /(^#{1,6}\s{1}[\s\S]+?\n)/, ///c
	CheckList : /(\t*-{1}\s{1}[\sx\[\]]+(?:\s{1}[\s\S]+?\n{1}))/, ///c
	UnorderedListElem : /(\t*-{1}\s{1}[\s\S]+?\n{1})/, ///c
	OrderedListElem : /(\t*(\d{1,}\.{1})+\s{1}[\s\S]+?\n{1})/, ///c
	Bold : /(\*{2}[\s\S]+\*{2})/, ///c
	Italic : /(\*{1}[s\S]+\*{1})/, ///c
	Strikethrough : /(~{2}[\s\S]+~{2})/, ///c
	InlineCode : /(`{1}[\s\S]+`{1})/, ///c
} ///c

function SearchText(Text:string):MarkyT<number> ///c
{
	let RetArray:MarkyT<number>={
		BlockCode : Text.search(MarkdownRegex.BlockCode),
		Image : Text.search(MarkdownRegex.Image),
		Hyperlink : Text.search(MarkdownRegex.Hyperlink),
		Header : Text.search(MarkdownRegex.Header),
		CheckList : Text.search(MarkdownRegex.CheckList),
		UnorderedListElem : Text.search(MarkdownRegex.UnorderedListElem),
		OrderedListElem : Text.search(MarkdownRegex.OrderedListElem),
		Bold : Text.search(MarkdownRegex.Bold),
		Italic : Text.search(MarkdownRegex.Italic),
		Strikethrough : Text.search(MarkdownRegex.Strikethrough),
		InlineCode : Text.search(MarkdownRegex.InlineCode)
	}
	return RetArray;
}

function MarkyBlockCode(Text:string):string ///c
{
	while (Text[0] == "`")
	{
		Text = Text.slice(1,-1)
	}
	while (Text[-1] == "`")
	{
		Text = Text.slice(0,-2)
	}
	return "<code>" + Marky(Text) + "</code>"
}
function MarkyBold(Text:string):string ///c
{
	while (Text[0] == "*"||Text[0]==" "){
		Text = Text.slice(1,-1)
	}
	while (Text[-1] == "*"||Text[-1]==" "){
		Text = Text.slice(0,-2)
	}
	return "<strong>" + Marky(Text) + "</strong>"
}
function MarkyHeader(Text:string):string ///c
{
	while (Text[0] == "#"||Text[0] == " "){
		Text = Text.slice(1)
	}
	Text = Text.slice(0,-1)
	let IdText = Text.toLowerCase()
	IdText = IdText.replace(/\s/g,"-")
	IdText = IdText.replace(/\*/g,"")
	IdText = IdText.replace(/~/g,"")
	IdText = IdText.replace(/`/g,"")
	
	return "<h1 id=\"" + IdText + "\"" +" >" + Marky(Text) +"</h1>"
}
function MarkyCheckList(Text:string):string ///c
{
	while (Text[0] == "-" || Text[0] == " "){
		Text = Text.slice(1)
	}
	let IsChecked = false
	if (Text[1] == "x"){
		IsChecked = true
	}
	Text = Text.slice(3)
	const CheckListId = Text.toLowerCase().replace(" ", "-")
	let Ret = "<label for=\"" + CheckListId +"\"" + ">" + Marky(Text) + "</label>" + "<input id=\"" + CheckListId + "\" type=\"checkbox\" onclick=\"return false;\" "
	if (IsChecked == true) Ret += "checked"
	Ret += "/>" + "<br/>"
	return Ret
}
function MarkyHyperlink(Text:string):string ///c
{
	Text = Text.slice(1)
	Text = Text.slice(0,-1)
	Text = Text.replace(")[", " ")
	return "<a href=\"" + Text.split(" ")[1] + "\"" + ">" + Marky(Text.split(" ")[0]) + "</a>"
}
function MarkyImage(Text:string):string ///c
{
	Text = Text.slice(2)
	Text = Text.slice(0,-1)
	Text = Text.replace(")[", " ")
	return "<img src=\"" + Text.split(" ")[1] + "\"" + " alt=\"" + Text.split(" ")[0] + "\"/>"
}
// TODO fill these functions in to make them process  markdown elements
function MarkyInlineCode(Text:string):string ///c
{
	while (Text[0] == "`" || Text[0]== " "){
		Text = Text.slice(1,-1)
	}
	while (Text[-1] == "`" || Text[-1] == " "){
		Text = Text.slice(0,-1)
	}
	return "<code>" + Marky(Text) + "</code>"

}
function MarkyItalic(Text:string):string ///c
{
	while (Text[0] == "*" || Text[0]== " "){
		Text = Text.slice(1,-1)
	}
	while (Text[-1] == "*" || Text[-1] == " "){
		Text = Text.slice(0,-1)
	}
	return "<i>" + Marky(Text) + "</i>"
}
function MarkyOrderedList(Text:string):string ///c
{
	let Tabs = 0
	let SideVal = ""
	while(Text[0] != " "){
		if (Text[0] == "\t") Tabs++
		else SideVal += Text[0]

		Text = Text.slice(1)
	}
	Text = Text.slice(1)
	let Ret = "<div class=\"markdown-ol\"><span class=\"markdown-tab\">"
	while (Tabs != 0){
		Ret += "> "
		Tabs--
	}
	Ret += "</span><span class=\"markdown-ol-marker\">" + SideVal + "</span><span class=\"markdown-ol-content\">" + Marky(Text) + "</span></div>"
	return Ret
}
function MarkyStrikethrough(Text:string):string ///c
{
	while (Text[0] == "~"||Text[0]==" "){
		Text = Text.slice(1,-1)
	}
	while (Text[-1] == "~"||Text[-1]==" "){
		Text = Text.slice(0,-1)
	}
	return "<del>" + Marky(Text) + "</del>"
}
function MarkyUnorderedList(Text:string):string ///c
{
	let Tabs = 0
	while (Text[0] != " "){
		if (Text[0] == "\t")Tabs++
		Text = Text.slice(1)
	}
	let Ret = "<div class=\"markdown-ul\"><span class=\"markdown-tab\">"
	while (Tabs != 0){
		Ret += "> "
		Tabs--
	}
	Ret += "</span>> <span class=\"markdown-ul-content\">" + Marky(Text) + "</span></div>"
	return Ret

}

export default function Marky(Text:string):string ///c
{
	let NewText = ""
	while (Text.length != 0){
		let Smallest = Infinity
		let Type:MarkType | null= null

		const Raw = SearchText(Text)
		const PosBlockCode = Raw.BlockCode
		const PosBold = Raw.Bold
		const PosCheckList = Raw.CheckList
		const PosHeader = Raw.Header
		const PosHyperlink = Raw.Hyperlink
		const PosImage = Raw.Image
		const PosInlineCode = Raw.InlineCode
		const PosItalic  = Raw.Italic
		const PosOrderedListElem = Raw.OrderedListElem
		const PosStrikethrough = Raw.Strikethrough
		const PosUnorderedListElem = Raw.UnorderedListElem
		if (PosBlockCode < Smallest && PosBlockCode != -1) {Smallest = PosBlockCode;Type = MarkType.BlockCode}
		if (PosBold < Smallest && PosBold != -1) {Smallest = PosBold;Type = MarkType.Bold}
		if (PosCheckList < Smallest && PosCheckList != -1) {Smallest = PosCheckList;Type = MarkType.CheckList}
		if (PosHeader < Smallest && PosHeader != -1) {Smallest = PosHeader;Type = MarkType.Header}
		if (PosHyperlink < Smallest && PosHyperlink != -1) {Smallest = PosHyperlink;Type = MarkType.Hyperlink}
		if (PosImage < Smallest && PosImage != -1) {Smallest = PosImage;Type = MarkType.Image}
		if (PosInlineCode < Smallest && PosInlineCode != -1) {Smallest = PosInlineCode;Type = MarkType.InlineCode}
		if (PosItalic < Smallest && PosItalic != -1) {Smallest = PosItalic;Type = MarkType.Italic}
		if (PosOrderedListElem < Smallest && PosOrderedListElem != -1) {Smallest = PosOrderedListElem;Type = MarkType.OrderedList}
		if (PosStrikethrough < Smallest && PosStrikethrough != -1) {Smallest = PosStrikethrough;Type = MarkType.Strikethrough}
		if (PosUnorderedListElem < Smallest && PosUnorderedListElem != -1) {Smallest = PosUnorderedListElem;Type = MarkType.UnorderedList}
		
		if (Smallest == 0){
			switch (Type) {
				case MarkType.BlockCode:
					// @ts-ignore: This throws a "Possibly null" error, but this cannot be null because if there are no BlockCode's, this code wont even execute
					NewText += MarkyBlockCode(Text.match(MarkdownRegex.BlockCode)[0]);
					Text = Text.replace(MarkdownRegex.BlockCode,"")
					break;
				case MarkType.Bold:
					// @ts-ignore
					NewText += MarkyBold(Text.match(MarkdownRegex.Bold)[0])
					Text = Text.replace(MarkdownRegex.Bold,"")
					break;
				case MarkType.CheckList:
					// @ts-ignore
					NewText += MarkyCheckList(Text.match(MarkdownRegex.CheckList)[0])
					Text = Text.replace(MarkdownRegex.CheckList,"")
					break;
				case MarkType.Header:
					// @ts-ignore
					NewText += MarkyHeader(Text.match(MarkdownRegex.Header)[0])
					Text = Text.replace(MarkdownRegex.Header,"")
					break;
				case MarkType.Hyperlink:
					// @ts-ignore
					NewText += MarkyHyperlink(Text.match(MarkdownRegex.Hyperlink)[0])
					Text = Text.replace(MarkdownRegex.Hyperlink,"")
					break;
				case MarkType.Image:
					// @ts-ignore
					NewText += MarkyImage(Text.match(MarkdownRegex.Image)[0])
					Text = Text.replace(MarkdownRegex.Image,"")
					break;
				case MarkType.InlineCode:
					// @ts-ignore
					NewText += MarkyInlineCode(Text.match(MarkdownRegex.InlineCode)[0])
					Text = Text.replace(MarkdownRegex.InlineCode,"")
					break;
				case MarkType.Italic:
					// @ts-ignore
					NewText += MarkyItalic(Text.match(MarkdownRegex.Italic)[0])
					Text = Text.replace(MarkdownRegex.Italic,"")
					break;
				case MarkType.OrderedList:
					// @ts-ignore
					NewText += MarkyOrderedList(Text.match(MarkdownRegex.OrderedListElem)[0])
					Text = Text.replace(MarkdownRegex.OrderedListElem,"")
					break;
				case MarkType.Strikethrough:
					// @ts-ignore
					NewText += MarkyStrikethrough(Text.match(MarkdownRegex.Strikethrough)[0])
					Text = Text.replace(MarkdownRegex.Strikethrough,"")
					break;
				case MarkType.UnorderedList:
					// @ts-ignore
					NewText += MarkyUnorderedList(Text.match(MarkdownRegex.UnorderedListElem)[0])
					Text = Text.replace(MarkdownRegex.UnorderedListElem,"")
					break;
			}
		}else{
			NewText += Text[0]
			Text = Text.slice(1)
		}
	}
	return NewText;
}
