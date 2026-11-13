# 빌드 컨텍스트는 모노레포 루트다. shared 패키지의 TS 원본을 함께 번들하므로 apps/api 폴더만으로는 빌드할 수 없다
FROM node:24.22.3-alpine AS base
WORKDIR /repo
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=true
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/

FROM base AS build
RUN yarn workspaces focus api
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN yarn workspace api build

FROM base AS prod-deps
RUN yarn workspaces focus api --production

FROM node:24.22.3-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=prod-deps /repo /repo
COPY --from=build /repo/apps/api/dist apps/api/dist
USER node
EXPOSE 4000
CMD ["node", "--enable-source-maps", "apps/api/dist/main.mjs"]
