import "./Marky/Mark.ts";
import "./Marky/MarkStyle.ts";

function Markify(Text:string):string
{
	// @ts-ignore
	return Marky(MarkyStyle(Text)).replace(/\n/g,"<br/>")
}