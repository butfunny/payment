var Vi = Vi || {};

Vi.hasMark = function(str) {
	for (var i = 0; i< str.length; i++) {
		if (Vi.markCharMap[str.charAt(i)] != null) {
			return true;
		}
	}
	return false;
}

Vi.removeMarkChar = function (c) {
	while (true) {
		var nonmarkChar = Vi.markCharMap[c];
		if (nonmarkChar==null) {
			return c;
		}
		c = nonmarkChar;
	}
}
Vi.removeMark = function (str) {
	var ret = "";
	for (var i = 0; i< str.length; i++) {
		ret += Vi.removeMarkChar(str.charAt(i));
	}
	return ret;
}
	
Vi.markCharMap = {
		"à": "a",
		"á": "a",
		"ã": "a",
		"ả": "a",
		"ạ": "a",
		"ă": "a",
		"â": "a",
		"ằ": "ă",
		"ắ": "ă",
		"ẵ": "ă",
		"ẳ": "ă",
		"ặ": "ă",
		"ầ": "â",
		"ấ": "â",
		"ẫ": "â",
		"ẩ": "â",
		"ậ": "â",
		"è": "e",
		"é": "e",
		"ẽ": "e",
		"ẻ": "e",
		"ẹ": "e",
		"ê": "e",
		"ề": "ê",
		"ế": "ê",
		"ễ": "ê",
		"ể": "ê",
		"ệ": "ê",
		"ì": "i",
		"í": "i",
		"ĩ": "i",
		"ỉ": "i",
		"ị": "i",
		"ò": "o",
		"ó": "o",
		"õ": "o",
		"ỏ": "o",
		"ọ": "o",
		"ơ": "o",
		"ô": "o",
		"ồ": "ô",
		"ố": "ô",
		"ỗ": "ô",
		"ổ": "ô",
		"ộ": "ô",
		"ờ": "ơ",
		"ớ": "ơ",
		"ỡ": "ơ",
		"ở": "ơ",
		"ợ": "ơ",
		"ù": "u",
		"ú": "u",
		"ũ": "u",
		"ủ": "u",
		"ụ": "u",
		"ư": "u",
		"ừ": "ư",
		"ứ": "ư",
		"ữ": "ư",
		"ử": "ư",
		"ự": "ư",
		"ỳ": "y",
		"ý": "y",
		"ỹ": "y",
		"ỷ": "y",
		"ỵ": "y",
		"đ": "d"
}

Vi.markedCharsLowered = function() {
	var ret = [];
	for (var c in Vi.markCharMap) {
		ret.push(c);
	}
	return ret.join("");
}