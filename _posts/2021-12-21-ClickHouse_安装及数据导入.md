---
layout: post
title: "ClickHouse 安装及数据导入"
date: 2021-12-21T11:32:31Z
---
# ClickHouse 安装及数据导入

以下是 ClickHouse 的安装及数据导入过程，可帮助你快速搭建环境及上手查询，适用于教学。内容主要来自官方文档中  [ClickHouse Tutorial](https://clickhouse.com/docs/en/getting-started/tutorial/#example-queries) 部分。

## 安装

根据[官方文档 How to Build ClickHouse on Mac OS X](https://clickhouse.com/docs/en/development/build-osx/) 可在 Mac OS 上通过编译安装，但平时开发和教学直接使用 Docker 环境即可，方便快捷问题少。

根据这个 [Github Issue](https://github.com/ClickHouse/ClickHouse/issues/2232#issuecomment-500614531) 中的步骤使用  Docker 进行安装：

1. 首先当然得安装 [Docker Desktop](https://www.docker.com/products/docker-desktop) 。
2. 通过如下命令创建窗口并运行，同时导出对应端口：`docker run -d --name clickhouse-local -p 8123:8123 -p 9000:9000 --ulimit nofile=262144:262144 yandex/clickhouse-server`。
3. 然后通过如下命令进入进入窗口命令行： `sudo docker exec -it clickhouse-local bash`。
4. 此时就可以通过 `clickhouse-client` 进行交互了，比如查看版本 `clickhouse-client -V`。
5. 创建示例数据库 `CREATE DATABASE myfirstdatabase`。
6. 也可使用 [DBeaver](https://dbeaver.io/) 作为客户端来连接后操作。JDBC 连接串类型于这样: `jdbc:clickhouse://<USER>:<PASSWORD>@[localhost](http://localhost):8123/<DATABASE>`。通过上述步骤部署到本机的话 host 直接写 `localhost` 即可。

注意：如果安装后发现启动失败，报 9000 端口被占用，可通过 `kill -9 $(lsof -ti:9000)` 关闭掉占用程序后重试。

## 导入示例数据库

通过文档可查看更加全面的导入数据的方式，这里展示的只是其中最常用的一种。

### 下载示例数据

下载如下示例数据：

```bash
curl https://datasets.clickhouse.com/hits/tsv/hits_v1.tsv.xz | unxz --threads=`nproc` > hits_v1.tsv
curl https://datasets.clickhouse.com/visits/tsv/visits_v1.tsv.xz | unxz --threads=`nproc` > visits_v1.tsv
```

两个文件解压后 ~10G 。

### 创建数据库

注意：如下及后续 SQL 语句，都可通过 `clickhouse-client` 命令行或其他客户端工具比如 DBeaver 来完成。

同其它数据库一样，数据以数据库为单位进行区分，通过如下命令创建将要用到的示例数据库：

```sql
clickhouse-client --query "CREATE DATABASE IF NOT EXISTS tutorial"
```

### 建表

接下来开始建表，建表语句主要包含如下三方面信息：

- 表名
- 表结构，包括其中的列及对应的数据类型
- 指定表使用的[引擎](https://clickhouse.com/docs/en/engines/table-engines/)及其他影响查询的设置

创建两张表，其中：

- `hits` 记录用户在站点的点击行为
- `visits` 为一些预计的用户访问数据

- 创建 hits 表
    
    ```sql
    CREATE TABLE tutorial.hits_v1
    (
        `WatchID` UInt64,
        `JavaEnable` UInt8,
        `Title` String,
        `GoodEvent` Int16,
        `EventTime` DateTime,
        `EventDate` Date,
        `CounterID` UInt32,
        `ClientIP` UInt32,
        `ClientIP6` FixedString(16),
        `RegionID` UInt32,
        `UserID` UInt64,
        `CounterClass` Int8,
        `OS` UInt8,
        `UserAgent` UInt8,
        `URL` String,
        `Referer` String,
        `URLDomain` String,
        `RefererDomain` String,
        `Refresh` UInt8,
        `IsRobot` UInt8,
        `RefererCategories` Array(UInt16),
        `URLCategories` Array(UInt16),
        `URLRegions` Array(UInt32),
        `RefererRegions` Array(UInt32),
        `ResolutionWidth` UInt16,
        `ResolutionHeight` UInt16,
        `ResolutionDepth` UInt8,
        `FlashMajor` UInt8,
        `FlashMinor` UInt8,
        `FlashMinor2` String,
        `NetMajor` UInt8,
        `NetMinor` UInt8,
        `UserAgentMajor` UInt16,
        `UserAgentMinor` FixedString(2),
        `CookieEnable` UInt8,
        `JavascriptEnable` UInt8,
        `IsMobile` UInt8,
        `MobilePhone` UInt8,
        `MobilePhoneModel` String,
        `Params` String,
        `IPNetworkID` UInt32,
        `TraficSourceID` Int8,
        `SearchEngineID` UInt16,
        `SearchPhrase` String,
        `AdvEngineID` UInt8,
        `IsArtifical` UInt8,
        `WindowClientWidth` UInt16,
        `WindowClientHeight` UInt16,
        `ClientTimeZone` Int16,
        `ClientEventTime` DateTime,
        `SilverlightVersion1` UInt8,
        `SilverlightVersion2` UInt8,
        `SilverlightVersion3` UInt32,
        `SilverlightVersion4` UInt16,
        `PageCharset` String,
        `CodeVersion` UInt32,
        `IsLink` UInt8,
        `IsDownload` UInt8,
        `IsNotBounce` UInt8,
        `FUniqID` UInt64,
        `HID` UInt32,
        `IsOldCounter` UInt8,
        `IsEvent` UInt8,
        `IsParameter` UInt8,
        `DontCountHits` UInt8,
        `WithHash` UInt8,
        `HitColor` FixedString(1),
        `UTCEventTime` DateTime,
        `Age` UInt8,
        `Sex` UInt8,
        `Income` UInt8,
        `Interests` UInt16,
        `Robotness` UInt8,
        `GeneralInterests` Array(UInt16),
        `RemoteIP` UInt32,
        `RemoteIP6` FixedString(16),
        `WindowName` Int32,
        `OpenerName` Int32,
        `HistoryLength` Int16,
        `BrowserLanguage` FixedString(2),
        `BrowserCountry` FixedString(2),
        `SocialNetwork` String,
        `SocialAction` String,
        `HTTPError` UInt16,
        `SendTiming` Int32,
        `DNSTiming` Int32,
        `ConnectTiming` Int32,
        `ResponseStartTiming` Int32,
        `ResponseEndTiming` Int32,
        `FetchTiming` Int32,
        `RedirectTiming` Int32,
        `DOMInteractiveTiming` Int32,
        `DOMContentLoadedTiming` Int32,
        `DOMCompleteTiming` Int32,
        `LoadEventStartTiming` Int32,
        `LoadEventEndTiming` Int32,
        `NSToDOMContentLoadedTiming` Int32,
        `FirstPaintTiming` Int32,
        `RedirectCount` Int8,
        `SocialSourceNetworkID` UInt8,
        `SocialSourcePage` String,
        `ParamPrice` Int64,
        `ParamOrderID` String,
        `ParamCurrency` FixedString(3),
        `ParamCurrencyID` UInt16,
        `GoalsReached` Array(UInt32),
        `OpenstatServiceName` String,
        `OpenstatCampaignID` String,
        `OpenstatAdID` String,
        `OpenstatSourceID` String,
        `UTMSource` String,
        `UTMMedium` String,
        `UTMCampaign` String,
        `UTMContent` String,
        `UTMTerm` String,
        `FromTag` String,
        `HasGCLID` UInt8,
        `RefererHash` UInt64,
        `URLHash` UInt64,
        `CLID` UInt32,
        `YCLID` UInt64,
        `ShareService` String,
        `ShareURL` String,
        `ShareTitle` String,
        `ParsedParams` Nested(
            Key1 String,
            Key2 String,
            Key3 String,
            Key4 String,
            Key5 String,
            ValueDouble Float64),
        `IslandID` FixedString(16),
        `RequestNum` UInt32,
        `RequestTry` UInt8
    )
    ENGINE = MergeTree()
    PARTITION BY toYYYYMM(EventDate)
    ORDER BY (CounterID, EventDate, intHash32(UserID))
    SAMPLE BY intHash32(UserID)
    ```
    

- 创建 visits 表
    
    ```sql
    CREATE TABLE tutorial.visits_v1
    (
        `CounterID` UInt32,
        `StartDate` Date,
        `Sign` Int8,
        `IsNew` UInt8,
        `VisitID` UInt64,
        `UserID` UInt64,
        `StartTime` DateTime,
        `Duration` UInt32,
        `UTCStartTime` DateTime,
        `PageViews` Int32,
        `Hits` Int32,
        `IsBounce` UInt8,
        `Referer` String,
        `StartURL` String,
        `RefererDomain` String,
        `StartURLDomain` String,
        `EndURL` String,
        `LinkURL` String,
        `IsDownload` UInt8,
        `TraficSourceID` Int8,
        `SearchEngineID` UInt16,
        `SearchPhrase` String,
        `AdvEngineID` UInt8,
        `PlaceID` Int32,
        `RefererCategories` Array(UInt16),
        `URLCategories` Array(UInt16),
        `URLRegions` Array(UInt32),
        `RefererRegions` Array(UInt32),
        `IsYandex` UInt8,
        `GoalReachesDepth` Int32,
        `GoalReachesURL` Int32,
        `GoalReachesAny` Int32,
        `SocialSourceNetworkID` UInt8,
        `SocialSourcePage` String,
        `MobilePhoneModel` String,
        `ClientEventTime` DateTime,
        `RegionID` UInt32,
        `ClientIP` UInt32,
        `ClientIP6` FixedString(16),
        `RemoteIP` UInt32,
        `RemoteIP6` FixedString(16),
        `IPNetworkID` UInt32,
        `SilverlightVersion3` UInt32,
        `CodeVersion` UInt32,
        `ResolutionWidth` UInt16,
        `ResolutionHeight` UInt16,
        `UserAgentMajor` UInt16,
        `UserAgentMinor` UInt16,
        `WindowClientWidth` UInt16,
        `WindowClientHeight` UInt16,
        `SilverlightVersion2` UInt8,
        `SilverlightVersion4` UInt16,
        `FlashVersion3` UInt16,
        `FlashVersion4` UInt16,
        `ClientTimeZone` Int16,
        `OS` UInt8,
        `UserAgent` UInt8,
        `ResolutionDepth` UInt8,
        `FlashMajor` UInt8,
        `FlashMinor` UInt8,
        `NetMajor` UInt8,
        `NetMinor` UInt8,
        `MobilePhone` UInt8,
        `SilverlightVersion1` UInt8,
        `Age` UInt8,
        `Sex` UInt8,
        `Income` UInt8,
        `JavaEnable` UInt8,
        `CookieEnable` UInt8,
        `JavascriptEnable` UInt8,
        `IsMobile` UInt8,
        `BrowserLanguage` UInt16,
        `BrowserCountry` UInt16,
        `Interests` UInt16,
        `Robotness` UInt8,
        `GeneralInterests` Array(UInt16),
        `Params` Array(String),
        `Goals` Nested(
            ID UInt32,
            Serial UInt32,
            EventTime DateTime,
            Price Int64,
            OrderID String,
            CurrencyID UInt32),
        `WatchIDs` Array(UInt64),
        `ParamSumPrice` Int64,
        `ParamCurrency` FixedString(3),
        `ParamCurrencyID` UInt16,
        `ClickLogID` UInt64,
        `ClickEventID` Int32,
        `ClickGoodEvent` Int32,
        `ClickEventTime` DateTime,
        `ClickPriorityID` Int32,
        `ClickPhraseID` Int32,
        `ClickPageID` Int32,
        `ClickPlaceID` Int32,
        `ClickTypeID` Int32,
        `ClickResourceID` Int32,
        `ClickCost` UInt32,
        `ClickClientIP` UInt32,
        `ClickDomainID` UInt32,
        `ClickURL` String,
        `ClickAttempt` UInt8,
        `ClickOrderID` UInt32,
        `ClickBannerID` UInt32,
        `ClickMarketCategoryID` UInt32,
        `ClickMarketPP` UInt32,
        `ClickMarketCategoryName` String,
        `ClickMarketPPName` String,
        `ClickAWAPSCampaignName` String,
        `ClickPageName` String,
        `ClickTargetType` UInt16,
        `ClickTargetPhraseID` UInt64,
        `ClickContextType` UInt8,
        `ClickSelectType` Int8,
        `ClickOptions` String,
        `ClickGroupBannerID` Int32,
        `OpenstatServiceName` String,
        `OpenstatCampaignID` String,
        `OpenstatAdID` String,
        `OpenstatSourceID` String,
        `UTMSource` String,
        `UTMMedium` String,
        `UTMCampaign` String,
        `UTMContent` String,
        `UTMTerm` String,
        `FromTag` String,
        `HasGCLID` UInt8,
        `FirstVisit` DateTime,
        `PredLastVisit` Date,
        `LastVisit` Date,
        `TotalVisits` UInt32,
        `TraficSource` Nested(
            ID Int8,
            SearchEngineID UInt16,
            AdvEngineID UInt8,
            PlaceID UInt16,
            SocialSourceNetworkID UInt8,
            Domain String,
            SearchPhrase String,
            SocialSourcePage String),
        `Attendance` FixedString(16),
        `CLID` UInt32,
        `YCLID` UInt64,
        `NormalizedRefererHash` UInt64,
        `SearchPhraseHash` UInt64,
        `RefererDomainHash` UInt64,
        `NormalizedStartURLHash` UInt64,
        `StartURLDomainHash` UInt64,
        `NormalizedEndURLHash` UInt64,
        `TopLevelDomain` UInt64,
        `URLScheme` UInt64,
        `OpenstatServiceNameHash` UInt64,
        `OpenstatCampaignIDHash` UInt64,
        `OpenstatAdIDHash` UInt64,
        `OpenstatSourceIDHash` UInt64,
        `UTMSourceHash` UInt64,
        `UTMMediumHash` UInt64,
        `UTMCampaignHash` UInt64,
        `UTMContentHash` UInt64,
        `UTMTermHash` UInt64,
        `FromHash` UInt64,
        `WebVisorEnabled` UInt8,
        `WebVisorActivity` UInt32,
        `ParsedParams` Nested(
            Key1 String,
            Key2 String,
            Key3 String,
            Key4 String,
            Key5 String,
            ValueDouble Float64),
        `Market` Nested(
            Type UInt8,
            GoalID UInt32,
            OrderID String,
            OrderPrice Int64,
            PP UInt32,
            DirectPlaceID UInt32,
            DirectOrderID UInt32,
            DirectBannerID UInt32,
            GoodID String,
            GoodName String,
            GoodQuantity Int32,
            GoodPrice Int64),
        `IslandID` FixedString(16)
    )
    ENGINE = CollapsingMergeTree(Sign)
    PARTITION BY toYYYYMM(StartDate)
    ORDER BY (CounterID, StartDate, intHash32(UserID), VisitID)
    SAMPLE BY intHash32(UserID)
    ```
    

### 数据导入

通过 [INSERT INTO](https://clickhouse.com/docs/en/sql-reference/statements/insert-into/) 语句进行数据导入操作，所支持的完整格式列表可参见文档 [supported serialization formats](https://clickhouse.com/docs/en/interfaces/formats/)。

前面下载的数据为 tab 分隔的数据，使用如下语句进行导入：

```bash
clickhouse-client --query "INSERT INTO tutorial.hits_v1 FORMAT TSV" --max_insert_block_size=100000 < hits_v1.tsv
clickhouse-client --query "INSERT INTO tutorial.visits_v1 FORMAT TSV" --max_insert_block_size=100000 < visits_v1.tsv
```

但问题来了，如果是本地原生的 ClickHouse 是可以像上在这样操作的，但如果是通过 docker 启的，执行 `clickhouse-client` 是在 docker 环境里，里面并没有我们将要导入的数据文件 `*.tsv`。

此时有两个方法，一是通过客户端软件比如 DBeaver 进行导入，无奈其文件选项没有 tsv 格式：

![image](https://user-images.githubusercontent.com/3783096/146922554-febfe7b1-6380-4834-a06c-08efaf09c479.png)

二是将 tsv 文件复制到容器中，假设已经在容器中创建了一个临时目录 `tmp_data` 来保存，当然不是必需的，复制到根目录，也可以。通过如下命令来完成复制：

```bash
docker cp hits_v1.tsv container_id:tmp_data/
docker cp visits_v1.tsv container_id:tmp_data/
```

注意：bye the way, 通过 `docker container ls` 查看容器对应的 id。

此时就可以进行导入操作了。因为文件比较大，如果报如下错误，一定会报的：

```bash
# clickhouse-client --query "INSERT INTO tutorial.hits_v1 FORMAT TSV" --max_insert_block_size=100000 < tmp_data/hits_v1.tsv
Received exception from server (version 21.12.2):
Code: 241. DB::Exception: Received from localhost:9000. DB::Exception: Memory limit (total) exceeded: would use 1.75 GiB (attempt to allocate chunk of 31462368 bytes), maximum: 1.74 GiB. (MEMORY_LIMIT_EXCEEDED)
(query: INSERT INTO tutorial.hits_v1 FORMAT TSV)
```

根据这个[这个 Github Issue](https://github.com/ClickHouse/ClickHouse/issues/11153#issuecomment-633212510) 中的解决，创建自定义配置文件 config.xml 设置如下配置即可：

```xml
<max_server_memory_usage_to_ram_ratio>100</max_server_memory_usage_to_ram_ratio>
```

首先创建配置文件，直接从镜像中将默认的配置复制出来：

```bash
docker cp <container_id>:/etc/clickhouse-server/config.xml ./
```

上面 container_id 为本地运行后的 ID。打开复制出来的配置文件修改 `max_server_memory_usage_to_ram_ratio` 为 100。

同时根据 Docker Hub 中 ClickHouse 镜像的[文档描述](https://www.notion.so/yandex-clickhouse-server-99967468ddb04826b1a46a947893048a)中得知，启动镜像时增加指定配置的参数，即通过如下命令启动，注意此时可能需要将原来的容器删除重新启动，因为之前的名称已经被占用。

```bash
docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 --ulimit nofile=262144:262144 -v /path/to/config.xml yandex/clickhouse-server
```

注意上面 `-v` 后面跟的配置文件路径需要是绝对路径。

重启后再重试前述导入操作，不出意外应该会成功了。

导入成功后已经能查看到数据：

![image](https://user-images.githubusercontent.com/3783096/147022323-2b18abf2-cb38-4c44-83ad-770bd7013969.png)


以上。

## 相关资源

- [ClickHouse Tutorial](https://clickhouse.com/docs/en/getting-started/tutorial/#example-queries)
- [How to copy files from host to Docker container?](https://stackoverflow.com/a/31971697/1553656)
- [Memory limit (total) exceeded issues with wait_end_of_query=1 #11153](https://www.notion.so/ClickHouse-685c4ae400364d75b44c22b41004eec2)
- [yandex/clickhouse-server](https://hub.docker.com/r/yandex/clickhouse-server)
