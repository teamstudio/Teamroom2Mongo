package com.teamstudio.momo;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import com.ibm.commons.util.StringUtil;

import lotus.domino.Database;
import lotus.domino.Name;
import lotus.domino.View;
import lotus.domino.ViewEntry;
import lotus.domino.ViewEntryCollection;

public class TeamroomMetadata {

	private String name;
	private String purpose;
	private List<HashMap> members;

	@SuppressWarnings("unchecked")
	public TeamroomMetadata(Database dbTeamroom) {

		try {

			View vw = dbTeamroom.getView("MissionLookup");
			ViewEntryCollection vec = vw.getAllEntries();

			ViewEntry ve = vec.getFirstEntry();
			if (null != ve) {

				Vector colValues = ve.getColumnValues();
				if (!colValues.isEmpty()) {
					name = (String) colValues.get(1);
					purpose = (String) colValues.get(2);

				}

			}

			vw.recycle();

			//get members
			String dbPath = "/" + dbTeamroom.getFilePath().replace("\\", "/");

			members = new ArrayList<HashMap>();

			vw = dbTeamroom.getView("PeopleLookup");
			vec = vw.getAllEntries();
			ve = vec.getFirstEntry();
			while (ve != null) {
				Vector colValues = ve.getColumnValues();
				if (!colValues.isEmpty()) {
					Name n = dbTeamroom.getParent().createName((String) colValues.get(0));
					
					HashMap<String,String> member = new HashMap<String, String>();
					member.put("name", n.getCommon());
					
					String thumbnailUrl = (String) colValues.get(5);
					
					if (StringUtil.isNotEmpty(thumbnailUrl)) {
						thumbnailUrl = dbPath + "/0/" + ve.getUniversalID() + "/$file/" + java.net.URLEncoder.encode(thumbnailUrl, "UTF-8");
					}
					
					member.put("thumbnailUrl", thumbnailUrl);
					member.put("email", (String) colValues.get(1));
					
					members.add(member);

				}
				ViewEntry t = vec.getNextEntry();
				ve.recycle();
				ve = t;
			}

			vw.recycle();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}

	}

	public String getName() {
		return name;
	}

	public String getPurpose() {
		return purpose;
	}

	public List<HashMap> getMembers() {
		return members;
	}

}
