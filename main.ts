import Marky from "./Marky/Mark.ts";
import MarkyStyle from "./Marky/MarkStyle.ts";
const MarkdownFile = Deno.readTextFileSync(Deno.args[0])
const HtmlFileName = Deno.args[0].slice(0,-3) + ".html"
Deno.writeTextFileSync(HtmlFileName,Marky(MarkyStyle(MarkdownFile)).replace(/\n/g,"<br/>"))


