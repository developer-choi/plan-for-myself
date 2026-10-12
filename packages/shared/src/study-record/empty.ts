interface StudyRecordContent {
  studiedMinutes: readonly number[];
  failTags: readonly string[];
}

export function isEmptyStudyRecord({studiedMinutes, failTags}: StudyRecordContent): boolean {
  return studiedMinutes.every((minutes) => minutes === 0) && failTags.length === 0;
}
