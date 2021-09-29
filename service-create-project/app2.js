List < DebitBankAccountsListDto > debitBankAccountsList = new ArrayList < DebitBankAccountsListDto > ();
for (int i = 0; i < iMap.getSize(DEBIT_BANK_ACCOUNTS_LIST); i++) {
	DebitBankAccountsListDto debitBankAccounts = new DebitBankAccountsListDto();
	debitBankAccounts.setCardNo(iMap.getstring("DEBIT_BANK_ACCOUNTS_LIST", i, "CARD_NO"));
	debitBankAccounts.setCardGuid(iMap.getdouble("DEBIT_BANK_ACCOUNTS_LIST", i, "CARD_GUID"));
	debitBankAccounts.setTotalAmnt(iMap.getint("DEBIT_BANK_ACCOUNTS_LIST", i, "TOTAL_AMNT"));
	debitBankAccountsList.add(debitBankAccounts);
}



"List<ReserveInfoDto> reserveInfoList = new ArrayList<ReserveInfoDto>();\n"
1: "for(int i = 0; i< iMap.getSize(RESERVE_INFO_LIST); i++) {\n"
2: "\tReserveInfoDto reserveInfo = new ReserveInfoDto();\n"
"	\treserveInfo.setReserveRatio(iMap.get0(\"RESERVE_RATIO\"));\n"



mainRequestFileReq.setCardNo(iMap.getString("CARD_NO"));
mainRequestFileReq.setCardStatChangeDate(iMap.getDate("CARD_STAT_CHANGE_DATE"));

List < CardPointInfoDto > cardPointInfoList = new ArrayList < CardPointInfoDto > ();
if (imap.containsKey(CARD_POINT_INFO_LIST) && imap.get(CARD_POINT_INFO_LIST) != null && !imap.get(CARD_POINT_INFO_LIST).isEmpty()) {
	for (int i = 0; i < iMap.getSize(CARD_POINT_INFO_LIST); i++) {
		CardPointInfoDto cardPointInfo = new CardPointInfoDto();
		cardPointInfo.setEarnedPoint(iMap.getint("CARD_POINT_INFO_LIST", i, "EARNED_POINT"));
		cardPointInfo.setUsedPoint(iMap.getdouble("CARD_POINT_INFO_LIST", i, "USED_POINT"));
		cardPointInfo.setCampaignPoint(iMap.getBigDecimal("CARD_POINT_INFO_LIST", i, "CAMPAIGN_POINT"));

		List < DebtInfoList2Dto > debtInfoList2 = new ArrayList < DebtInfoList2Dto > ();
		if (imap.containsKey(DEBT_INFO_LIST2) && imap.get(DEBT_INFO_LIST2) != null && !imap.get(DEBT_INFO_LIST2).isEmpty()) {
			for (int i = 0; i < iMap.getSize(DEBT_INFO_LIST2); i++) {
				DebtInfoList2Dto debtInfo2 = new DebtInfoList2Dto();
				debtInfo2.setCurrency(iMap.getint("DEBT_INFO_LIST2", i, "CURRENCY"));
				debtInfo2.setTotalAmnt(iMap.getdouble("DEBT_INFO_LIST2", i, "TOTAL_AMNT"));

				List < DebtInfoList3Dto > debtInfoList3 = new ArrayList < DebtInfoList3Dto > ();
				if (imap.containsKey(DEBT_INFO_LIST3) && imap.get(DEBT_INFO_LIST3) != null && !imap.get(DEBT_INFO_LIST3).isEmpty()) {
					for (int i = 0; i < iMap.getSize(DEBT_INFO_LIST3); i++) {
						DebtInfoList3Dto debtInfo3 = new DebtInfoList3Dto();
						debtInfo3.setCurrency(iMap.getint("DEBT_INFO_LIST3", i, "CURRENCY"));
						debtInfo3.setTotalAmnt(iMap.getstring("DEBT_INFO_LIST3", i, "TOTAL_AMNT"));
						debtInfoList3.add(debtInfo3);
					}
					DebtInfoList2Dto.setDebtInfoList3(debtInfoList3);
				}

				debtInfoList2.add(debtInfo2);
			}
			CardPointInfoDto.setDebtInfoList2(debtInfoList2);
		}

		cardPointInfo.setAvaliablePoint(iMap.getint("CARD_POINT_INFO_LIST", i, "AVALIABLE_POINT"));
		cardPointInfoList.add(cardPointInfo);
	}
	MainRequestFileReq.setCardPointInfoList(cardPointInfoList);
}


List < DebtInfoListDto > debtInfoList = new ArrayList < DebtInfoListDto > ();
if (imap.containsKey(DEBT_INFO_LIST) && imap.get(DEBT_INFO_LIST) != null && !imap.get(DEBT_INFO_LIST).isEmpty()) {
	for (int i = 0; i < iMap.getSize(DEBT_INFO_LIST); i++) {
		DebtInfoListDto debtInfo = new DebtInfoListDto();
		debtInfo.setCurrency(iMap.getstring("DEBT_INFO_LIST", i, "CURRENCY"));
		debtInfo.setTotalAmnt(iMap.getint("DEBT_INFO_LIST", i, "TOTAL_AMNT"));
		debtInfoList.add(debtInfo);
	}
	MainRequestFileReq.setDebtInfoList(debtInfoList);
}

