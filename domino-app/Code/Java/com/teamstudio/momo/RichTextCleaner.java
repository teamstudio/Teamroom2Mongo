package com.teamstudio.momo;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class RichTextCleaner {

	private static final String DEFAULTSIZE = "1";
	private static final String DEFAULTFONT = "sans-serif";
	private static final String DEFAULTSTYLE = "";
	private static final String DEFAULTCOLOR = "";
	private static final String DEFAULTCLASS = "";

	public RichTextCleaner() {

	}

	public String getCleanHTML(String html) {

		String results = "";
		try {
			Document doc = Jsoup.parseBodyFragment(html);
			Element body = doc.body();
			Elements tags = body.getElementsByTag("font");

			for (Element tag : tags) {
				String tagSize = tag.attr("size");
				String tagFace = tag.attr("face");
				String tagColor = tag.attr("color");
				String tagStyle = tag.attr("style");
				String tagClass = tag.attr("class");
				
				//if (tagSize.equals("1") && tagFace.equals("sans-serif") ) {
					
		
				//	tag.unwrap();
				//} else 
					if (DEFAULTSIZE.equals(tagSize) && DEFAULTFONT.equals(tagFace) && DEFAULTCOLOR.equals(tagColor)
						&& DEFAULTSTYLE.equals(tagStyle) && DEFAULTCLASS.equals(tagClass)) {
					tag.unwrap();
				} else {
					tag.removeAttr("size");
					tag.removeAttr("face");
					tag.removeAttr("color");
					tag.removeAttr("style");
					tag.removeAttr("class");
					tag.tagName("span");
					String s = "";
					String c = "";
					if (!DEFAULTSTYLE.equals(tagStyle) && !"".equals(tagStyle)) {
						s = tagStyle;
					}
					if (!DEFAULTFONT.equals(tagFace) && !"".equals(tagFace)) {
						s += " font-family:" + tagFace + ";";
					}
					if (!DEFAULTCOLOR.equals(tagColor) && !"".equals(tagColor)) {
						s += " color:" + tagColor + ";";
					}
					if (!DEFAULTCLASS.equals(tagClass) && !"".equals(tagClass)) {
						c = tagClass;
					}
					if (!DEFAULTSIZE.equals(tagSize) && !"".equals(tagSize)) {
						c += " fontSize" + tagSize;
					}
					if (!"".equals(s)) {
						tag.attr("style", s.trim());
					}
					if (!"".equals(c)) {
						tag.attr("class", c.trim());
					}
				}
			}

			results = body.html();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return results;
	}

}
