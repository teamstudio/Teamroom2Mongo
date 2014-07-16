package com.teamstudio.momo;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.Item;
import lotus.domino.MIMEEntity;
import lotus.domino.NotesException;
import lotus.domino.RichTextItem;

import com.ibm.xsp.model.domino.wrapped.DominoDocument;
import com.ibm.xsp.model.domino.wrapped.DominoRichTextItem;

public class Utils {

	/*
	 * Wraps a lotus.domino.Document as a com.ibx.xsp.model.domino.wrapped.DominoDocument, including the RichText item
	 * 
	 * @param doc document to be wrapped
	 * 
	 * @param richTextItemName name of the rich text item containing standard RichText or MIME contents that need to be wrapped
	 */
	public static DominoDocument wrapDocument(final Document doc, final String richTextItemName) {
	
		DominoDocument wrappedDoc = null;
		
		Item itemRT = null;
	
		try {
			
			Database db = doc.getParentDatabase();
			
			//disable MIME to RichText conversion
			db.getParent().setConvertMIME(false);
	
			//wrap the lotus.domino.Document as a lotus.domino.DominoDocument
			//see http://public.dhe.ibm.com/software/dw/lotus/Domino-Designer/JavaDocs/DesignerAPIs/com/ibm/xsp/model/domino/wrapped/DominoDocument.html
			wrappedDoc = DominoDocument.wrap(doc.getParentDatabase().getFilePath(), doc, null, null, false, null, null);
	
			//see http://public.dhe.ibm.com/software/dw/lotus/Domino-Designer/JavaDocs/DesignerAPIs/com/ibm/xsp/model/domino/wrapped/DominoRichTextItem.html
			DominoRichTextItem drti = null;
	
			itemRT = doc.getFirstItem(richTextItemName);
	
			if (null != itemRT) {
	
				if (itemRT.getType() == Item.RICHTEXT) {
					
	
					//create a DominoRichTextItem from the RichTextItem
					RichTextItem rt = (RichTextItem) itemRT;
					drti = new DominoRichTextItem(wrappedDoc, rt);
	
				} else if (itemRT.getType() == Item.MIME_PART) {
	
					//create a DominoRichTextItem from the Rich Text item that contains MIME
					MIMEEntity rtAsMime = doc.getMIMEEntity(richTextItemName);
					drti = new DominoRichTextItem(wrappedDoc, rtAsMime, richTextItemName);
	
				}
				
			}
	
			wrappedDoc.setRichTextItem(richTextItemName, drti);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (itemRT != null) {
				try {
					itemRT.recycle();
				} catch (NotesException e) {
				}
			}
		}
	
		return wrappedDoc;
	
	}

}
