interface MarkStyleT<T> ///c
{ ///c
	Underline:T, ///c
	Background:T, ///c
	Foreground:T ///c
}///c

enum MarkStyleType ///c
{///c
	Underline, ///c
	Background, ///c
	Foreground ///c
}///c

const MarkStyleRegex:MarkStyleT<RegExp> = ///c
{
	Underline:/(_{2}[\s\S]+?_{2}[\d,]+?;[dws]?(?=\s|\n))/,
	Background:/(\|{2}[\s\S]+?\|{2}[\d,]+(?=\s|\n))/,
	Foreground:/(%{2}[\s\S]+?%{2}[\d,]+(?=\s|\n))/
}
function SearchStyleText(Text:string):MarkStyleT<number> ///c
{
	return {
		Underline:Text.search(MarkStyleRegex.Underline),
		Background: Text.search(MarkStyleRegex.Background),
		Foreground : Text.search(MarkStyleRegex.Foreground)
	}
}

function MarkyStyleUnderline(Text:string):string ///c
{
	Text = Text.slice(2)
	let Styler:string | string[] = ""
	while (Text[Text.length - 1] != "_"){
		Styler = Text[Text.length - 1] + Styler
		Text = Text.slice(0,-1)
	}
	Text = Text.slice(0,-2)
	Styler = Styler.split(";")
	let NewText = "<span style=\""
	NewText += "text-decoration-line : underline;"
	NewText += "text-decoration-color : rgb(" + Styler[0] + ");"
	if (NewText[1] == "s") NewText += "text-decoration-style : solid;"
	else if (NewText[1] == "d") NewText +="text-decoration-style : dotted;"
	else if (NewText[1] == "w") NewText += "text-decoration-style : wavy;"
	else NewText += "text-decoration-style : solid;"
	NewText += "\""
	NewText += ">"
	NewText += Text
	NewText += "</span>"
	return NewText
}
function MarkyStyleBackground(Text:string):string ///c
{
	Text = Text.slice(2)
	let Styler = ""
	while (Text[Text.length - 1] != "|"){
		console.log(Text)
		Styler = Text[Text.length - 1] + Styler
		Text = Text.slice(0,-1)
	}
	Text = Text.slice(0,-2)
	let NewText = "<span style=\""
	NewText += "background-color : rgb(" + Styler + ");"
	NewText += "\""
	NewText += ">"
	NewText += Text
	NewText += "</span>"
	return NewText
}
function MarkyStyleForeground(Text:string):string ///c
{
	Text = Text.slice(2)
	let Styler = ""

	while (Text[Text.length - 1] != "%"){
		Styler = Text[Text.length - 1] + Styler
		Text = Text.slice(0,-1)
	}
	Text = Text.slice(0,-2)
	let NewText = "<span style=\""
	NewText += "color : rgb(" + Styler + ");\">"
	NewText += Text
	NewText += "</span>"
	return NewText
}
export default function MarkyStyle(Text:string):string ///c
{
	let NewText = ""
	while (Text.length != 0){
		console.log(Text)
		let Smallest = Infinity
		let Type:MarkStyleType|null = null
		const Raw = SearchStyleText(Text)
		const PosUnderline = Raw.Underline
		const PosBackground = Raw.Background
		const PosForeground = Raw.Foreground
		if (PosUnderline < Smallest && PosUnderline != -1) {Smallest = PosUnderline;Type = MarkStyleType.Underline}
		if (PosBackground< Smallest && PosBackground != -1) {Smallest = PosBackground;Type = MarkStyleType.Background}
		if (PosForeground < Smallest && PosForeground != -1) {Smallest = PosForeground;Type = MarkStyleType.Foreground}
		if (Smallest == 0){
			switch (Type) {
				case MarkStyleType.Underline:
					// @ts-ignore
					NewText += MarkyStyleUnderline(Text.match(MarkStyleRegex.Underline)[0])
					Text = Text.replace(MarkStyleRegex.Underline,"")
					break;
				case MarkStyleType.Background:
					// @ts-ignore
					NewText += MarkyStyleBackground(Text.match(MarkStyleRegex.Background)[0])
					Text = Text.replace(MarkStyleRegex.Background,"")
					break;
				case MarkStyleType.Foreground:
					// @ts-ignore
					NewText += MarkyStyleForeground(Text.match(MarkStyleRegex.Foreground)[0])
					Text = Text.replace(MarkStyleRegex.Foreground,"")
					break;
			}
		}else{
			NewText += Text[0]
			Text= Text.slice(1)
		}
	}
	return NewText
}