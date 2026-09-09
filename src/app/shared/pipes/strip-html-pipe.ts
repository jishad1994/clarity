import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "stripHtml",
})
export class StripHtmlPipe implements PipeTransform {
    transform(value: string | null | undefined, maxLength = 120): string {
        if (!value) {
            return "";
        }
        const text = value
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
    }
}
