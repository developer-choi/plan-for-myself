# publish-update.mjs

스토어 앱(채널 `production`)에 EAS Update를 내보내고, 그 묶음의 소스맵을 Sentry에 올린다.

## 호출

`apps/mobile`에서:

```
yarn update:production "<업데이트 메시지>"
```

- `<업데이트 메시지>` — 필수. EAS 대시보드의 업데이트 목록에 그대로 보인다

업데이트는 이미 나가고 소스맵 업로드만 실패했을 때는 업로드만 다시 한다:

```
yarn update:production --sourcemaps-only
```

## 전제

- `apps/mobile/.env.local`에 `SENTRY_AUTH_TOKEN`이 있어야 소스맵이 올라간다. 값은 Sentry의 Organization Token이다
- `eas login`이 되어 있어야 한다
- 앱 `version`이 바뀌지 않은 빌드에만 닿는다(`runtimeVersion` 정책이 `appVersion`이다). 네이티브 코드가 바뀌었으면 업데이트가 아니라 새 빌드를 낸다

## 순서와 출력

1. `eas update --channel production --environment production --platform android`로 업데이트를 내보낸다. 출력의 `Update group ID`와 `EAS Dashboard` 주소가 이 업데이트를 가리킨다
2. 만들어진 `dist`의 소스맵을 Sentry에 올린다. 성공하면 `✅ Uploaded bundles and sourcemaps to Sentry successfully.`가 찍힌다

## 실패할 때

- 메시지를 안 주면 아무것도 내보내지 않고 exit 1로 끝난다
- 1단계 전에 sentry-cli 실행 파일과 `SENTRY_AUTH_TOKEN`이 있는지 본다. 하나라도 없으면 아무것도 내보내지 않고 끝난다
- 1단계가 실패하면 그 exit code로 끝나고 2단계는 돌지 않는다
- 2단계만 실패하면 업데이트는 이미 나간 상태다. 메시지를 주어 다시 돌리면 같은 업데이트가 한 번 더 나가므로, `--sourcemaps-only`로 소스맵만 다시 올린다

## 되돌리기

방금 내보낸 업데이트를 거두고 APK에 들어 있던 번들로 돌아가려면 `apps/mobile`에서:

```
yarn eas update:roll-back-to-embedded --channel production --runtime-version <앱 version> --platform android --message "<사유>" --non-interactive
```

폰은 앱을 켤 때 새 업데이트를 받고, 그다음 켤 때 적용한다.
