package com.teamstudio.momo;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import com.ibm.xsp.model.domino.wrapped.DominoDocument;
import com.ibm.xsp.model.domino.wrapped.DominoRichTextItem;

import lotus.domino.Document;
import lotus.domino.EmbeddedObject;
import lotus.domino.Item;
import lotus.domino.Name;
import lotus.domino.NotesException;
import lotus.domino.RichTextItem;

public class TeamroomDocument {

	private String subject;
	private String body;
	private List<HashMap> files;
	private String unid;
	private String noteId;
	private String author;
	private String type;

	public TeamroomDocument(Document doc) {
		Name from = null;

		try {
			this.unid = doc.getUniversalID().toLowerCase();
			this.noteId = doc.getNoteID().toLowerCase();
			this.subject = doc.getItemValueString("subject");

			this.files = getFiles(doc, "Body");
			this.body = getRichTextAsHTML(doc, "Body");

			if (doc.getItemValueString("form").equals("announcement")) {
				this.type = "announcement";
			} else {
				this.type = doc.getItemValueString("DocType").toLowerCase();
			}

			from = doc.getParentDatabase().getParent().createName(doc.getItemValueString("From"));

			this.author = from.getCommon();

		} catch (Exception e) {

			e.printStackTrace();
		} finally {

			try {
				from.recycle();
			} catch (NotesException e) {
		
			}
		}

	}

	private String getRichTextAsHTML(Document doc, String rtItemName) {

		DominoDocument ddoc = Utils.wrapDocument(doc, rtItemName);

		DominoRichTextItem drti = ddoc.getRichTextItem("Body");

		if (drti != null) {

			RichTextCleaner rtc = new RichTextCleaner();
			return rtc.getCleanHTML(drti.getHTML());
		}

		return "";

	}

	private List<HashMap> getFiles(Document doc, String itemName) throws UnsupportedEncodingException {

		List<HashMap> files = new ArrayList();

		try {

			String dbPath = "/" + doc.getParentDatabase().getFilePath().replace("\\", "/");

			Item itBody = doc.getFirstItem(itemName);

			if (itBody != null) {

				switch (itBody.getType()) {

				case Item.RICHTEXT:
					RichTextItem rt = (RichTextItem) itBody;
					Vector<EmbeddedObject> eos = rt.getEmbeddedObjects();
					for (EmbeddedObject eo : eos) {

						HashMap<String, String> f = new HashMap<String, String>();

						f
								.put("href", dbPath + "/0/" + doc.getUniversalID() + "/$file/"
										+ java.net.URLEncoder.encode(eo.getName(), "UTF-8"));
						f.put("name", eo.getName());

						files.add(f);
					}

				}
			}
		} catch (NotesException e) {
			e.printStackTrace();
		}

		return files;

	}

	public String getBody() {
		return body;
	}

	public String getSubject() {
		return subject;
	}

	public List<HashMap> getFiles() {
		return files;
	}

	public String getUnid() {
		return unid;
	}

	public String getNoteId() {
		return noteId;
	}

	public String getType() {
		return type;
	}

	public String getAuthor() {
		return author;
	}

}
