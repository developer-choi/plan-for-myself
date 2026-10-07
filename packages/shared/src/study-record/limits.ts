export const STUDY_RECORD_FIELD_LIMITS = {
  studiedMinutes: {min: 0, max: 1440},
  failTags: {maxCount: 2},
};

export const STUDY_RECORD_FIELD_MESSAGES = {
  studiedMinutes: `공부시간은 ${STUDY_RECORD_FIELD_LIMITS.studiedMinutes.min}~${STUDY_RECORD_FIELD_LIMITS.studiedMinutes.max} 사이의 숫자로 적어 주세요`,
  failTagCount: `실패 태그는 ${STUDY_RECORD_FIELD_LIMITS.failTags.maxCount}개까지예요`,
  failTagEmpty: '빈 실패 태그는 넣을 수 없어요',
  failTagSpace: '실패 태그에는 공백을 넣을 수 없어요',
};
