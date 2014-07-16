package com.teamstudio.momo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lotus.domino.Database;
import lotus.domino.Document;
import lotus.domino.NotesException;
import lotus.domino.Session;
import lotus.domino.View;

import com.ibm.commons.util.io.json.JsonGenerator;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.xsp.extlib.util.ExtLibUtil;

public class TeamroomREST {

	public static String doGet(HttpServletRequest request, HttpServletResponse response) {
		return doPost(request, response);
	}

	public static String doPost(HttpServletRequest request, HttpServletResponse response) {
		
		String strValue = "";
		int totalCount = 0;
		
		try {
			
			//Set response headers
			response.setContentType("application/json");
			response.setHeader("Cache-Control", "no-cache");

			//Open Teamroom DB
			Session s = ExtLibUtil.getCurrentSession();
			Database dbTeamroom = s.getDatabase("", "momo/teamroom.nsf");
			View vw = dbTeamroom.getView("xvwDocsByActiveDate");

			//get metadata
			TeamroomMetadata trMeta = new TeamroomMetadata(dbTeamroom);
			
			//Loop through all documents
			List<HashMap<String,Object>> documentsList = new ArrayList<HashMap<String,Object>>();

			Document doc = vw.getFirstDocument();
			while (null != doc) {

				TeamroomDocument trDoc = new TeamroomDocument(doc);

				HashMap<String, Object> entryMap = new HashMap<String, Object>();
				entryMap.put("unid", trDoc.getUnid());
				entryMap.put("noteId", trDoc.getNoteId());
				entryMap.put("author", trDoc.getAuthor());
				entryMap.put("type", trDoc.getType());
				entryMap.put("title", trDoc.getSubject());
				entryMap.put("body", trDoc.getBody());
				entryMap.put("files", trDoc.getFiles() );

				documentsList.add(entryMap);
				totalCount++;

				Document tmp = vw.getNextDocument(doc);
				doc.recycle();
				doc = tmp;
			}

			// Create a JSON object to wrap the docs Json array and provide the root element items
			JsonJavaObject returnJSON = new JsonJavaObject();
			
			HashMap<String, Object> metadata = new HashMap<String, Object>();
			metadata.put("name", trMeta.getName());
			metadata.put("purpose", trMeta.getPurpose());
			metadata.put("members", trMeta.getMembers());
			
			returnJSON.put("metadata", metadata);
			
			//total number of Items
			returnJSON.put("total", totalCount);
			
			// set the data element to the employee JSON list.
			returnJSON.put("items", documentsList);
			
			// Return a JSON string generated from our JsonJavaObject
			strValue = JsonGenerator.toJson(JsonJavaFactory.instanceEx, returnJSON);

		} catch (NotesException e) {
			strValue = "{\"success\":false,\"message\":\"" + e.getMessage() + "\"}";
			e.printStackTrace();
		} catch (Exception e) {
			strValue = "{\"success\":false,\"message\":\"" + e.getMessage() + "\"}";
			e.printStackTrace();
		}
		return strValue;
	}

}