# خريطة الكود — Code map

The app is built from these files, joined in the order of their names (`node scripts/build.mjs` → `dist/`).
يُجمع التطبيق من هذه الملفات بترتيب أسمائها. Every top-level function and constant is listed so a change can be found quickly.

## src/js

- **010-adhkar-data.js** (20 KB): ADHKAR
- **020-i18n-data.js** (20 KB): I18N_D, I18N_P
- **030-i18n.js** (6 KB): I18N_W, LIDX, RTL, LOC, LANGS, LANG, deDigits, hasAr, I18N_OK, i18nLoad(), Tx(), I18N_SKIP, i18nApply(), computeHijri(), KEY, LAT, LNG, CITIES, cityName, applyLoc(), nearestCity()
- **040-organs-data.js** (6 KB): ORGANS
- **050-organs.js** (1 KB): fmtD, AWRAD, HEARTS, PHASE
- **060-dates.js** (1 KB): pad, ds, addDays, TODAY, hijriDay, hijriLabel, DOW, seasonal()
- **070-prayer-times.js** (5 KB): rad, deg, fix, sunPos(), PT_M, ptAuto(), ptMethod(), prayerTimes(), ptAdjBox(), inMorocco(), hm, PRAYERS, PICONS
- **080-state.js** (2 KB): demoState(), blankOrgan(), freshState(), S
- **090-accounts.js** (31 KB): ADMIN_EMAIL, AUTH, CONTENT, adminData, isAdmin, gated, AUTH_ERR, authErr, authLangOpen, langPick(), viewAuth(), LOGO, GLOGO, authSubmit(), TEST_ACCT, testSignIn(), googleSignIn(), pendingName, OWNER, lsGet, lsSet, onAuthUser(), onFbFail(), cloudTimer, cloudSaveNow(), cloudSave(), adminTry(), TT, ttTick(), ttFlush(), INBOX, inboxLoad(), inboxCard(), fmtDur, adminLoad(), adminMsgsLoad(), adminMsgDel(), adminPush(), adU, uName …
- **100-content-editor.js** (24 KB): ED, edMode, UI, edNorm, edHash, ED_NO, ED_CARD, ED_LANGS, edApply(), edCardOf, edSaveUi(), edToast(), edBar(), edOpen(), ED_THEMES, ED_CSS0, ED_ST, edTheme(), edAdminBlock(), edClick(), adminSave(), announcementBanner(), onAuthRedirectError(), delAsk, acctMsg, accountSection(), authClick(), SCR, pz, pzD, pzEl(), PZ_OK, pzEnd(), navFix(), navT, save, YDAY, normOrgans(), orgMigrate(), orgSetStart() …
- **110-views.js** (14 KB): screen, confirmFor, confirmReset, redoFor, esc, ARROW, MENU, TITLES, VERSES, AVATAR, avatarImg(), MENUICON, BACK, nextPrayer(), heroHome(), homeNow(), amProgress(), heroSub(), NEW_HOST
- **120-quick-access-data.js** (8 KB): QI
- **130-quick-access.js** (5 KB): QA_ALL, QA_DEF, qaSel, qaDot, qaBtn, qaGrid(), qaGo(), homeProg(), sheetOpen(), sheetClose(), moreOpen(), qaEditOpen(), qaToggle()
- **140-first-steps.js** (3 KB): fsSteps(), fsCard(), iosGuide()
- **150-hints.js** (2 KB): HINTS, HINT_LINK, hintBtn, hintOpen()
- **160-path-info.js** (2 KB): RM_INFO, rmInfo()
- **170-search-home.js** (16 KB): usQ, viewSearch(), usIndex(), US_G, usResults(), usT, viewHome(), ring(), pendTxt(), tzEditBox(), tanwirAsk(), organCard()
- **180-prep-phase.js** (6 KB): PREP, prepFail, prepRedo, prepOpen, prepState(), prepDayDone, prepDays, prepReady, prepPendingToday, prepCard(), prepSet()
- **190-welcome.js** (4 KB): obStep, MEAN, meaning, needOnboard, viewOnboard(), obClick()
- **200-qa-cards.js** (4 KB): waredMsg, QA, qaDayIdx, DATA_OK, dataLoad(), qaSec, qaFocus, qaT, qaSecT, qaDir, qaCard(), viewQA(), openQA()
- **210-mushaf-index-data.js** (9 KB): QIDX
- **220-mushaf-index-m-data.js** (8 KB): QIDXM
- **230-mushaf.js** (18 KB): WIRD_OPTS, QBUF, QURL, mshMsg, mshDl, msh(), qKey, qHQ, qBundle(), qPage(), mshBr, mshCP, mushafPaint(), mushafGo(), SURAS, suraAt(), suraOnPage(), mshSur, mshY, mshAuto, mshRun, mshRaf, mshLast, mshEndAt, mshAcc, mshHold, MSEC, mshSpd, IC_PAUSE, IC_PLAY, mshPos, mshSet, mshUserTs, mshBase(), mshToTop(), mshTick(), mshAutoBar(), mshSurList(), viewQuran(), viewMushaf() …
- **240-subha.js** (6 KB): SUBHA_DEF, sbAdd, sbReset, sbEdit, sbZero, sb(), sbCount, sbTotal, subhaCard(), viewSubha(), sbMore(), sbTick()
- **250-khalwa.js** (8 KB): khEdit, khMsg, khDel, khList, pad2, localStr, khMs, khName, khEvents(), khState, fmtDT, hmMs, KH_SHORT, KH_DAY, khTemplate(), khNew(), khReadForm(), khForm(), khCard(), viewKhalwa(), khAlerted, khToast()
- **260-qalb-data.js** (7 KB): QALB
- **270-qalb.js** (12 KB): QLEV, qbI, qbStop, qbRetest, qb(), qbScore, qbLevel, qbRank, qbDay, qbD, viewQalb(), qbQuestion(), qbResults(), qbToday(), qbShowRes, UMRAH
- **280-umrah-data.js** (5 KB): UMART
- **290-umrah.js** (13 KB): umRed, UMRAH_UR, viewUmrah(), viewTaammulat(), MEDIA, isMedia, viewMraqib(), fmtS, mqBind(), mqToggle()
- **291-umrah-i18n.js** (26 KB): UMRAH_X, umU
- **295-umrah-check.js** (5 KB): UM_CHK, UM_CNT, UM_LAST, umS(), umNeed, umCounter(), umCheck(), umDoneCard(), umNewArm
- **300-tazkiya.js** (15 KB): tzTab, orgSel, tzMsg, tzDate, tzConf, tzEdit, tzDateBar(), tzPast(), MAX_ACTIVE, ORG_VERSE, TZ_TABS, tzSt(), tzTabs(), TZ_INFO, tzRow, TZI, tzHead(), tzStage(), viewTazkiya(), tzPrepOpen, tzRing(), tzToday(), tzPath(), viewOrgan()
- **310-muhasaba.js** (3 KB): mhState(), mhOn, ikMh(), mhMsg, viewMuhasaba()
- **320-ruhi-state.js** (2 KB): ruhiTab, RUHI_TABS, wkOff, wkData(), wkShare()
- **330-ijtihad-mirror.js** (11 KB): IJ_W, IJ_AW, IJ_BIRR, ijFirst(), ijDay(), ijWeek(), ijStreak(), ijTips(), ijNext(), viewIjtihad()
- **340-ruhi.js** (9 KB): RT_IC, RT_L, ruhiTabs(), viewMuraqabat(), wkHowOpen, viewWeek(), viewRuhi()
- **350-slips.js** (5 KB): SLIP_CATS, normAr, allSlips(), slipCands, slipCats(), WDAYS_AR, WDAYS, viewTahlil()
- **360-about.js** (10 KB): contactMsg, contactBusy, aboutOpen, ABI, VC_SAMPLE, voiceBox(), vcTry(), CHEV, acc(), viewAbout(), contactSend()
- **370-lights-data.js** (18 KB): BODY_MASK
- **380-lights.js** (5 KB): DAY, emptyMarks(), atH, nowStr, dayKey(), dH, ptDay, period(), lastTs, lights(), litCount, tHM, dayLbl, syncWird(), lightConfirm, figureSVG(), lightRow(), setLight()
- **390-prayers-row.js** (12 KB): FIVE, aDate, aLog, aDateBar(), prLate, MSJ, inMsj, prayerChips(), prLateKey, setPrayer(), wirdList(), naflDefs(), NAFL_IDS, AW_PICK, AW_X, AW_DAY, awDayOk, awList, nfFull, amPick(), naflLate(), awLate(), amPickOpen, amOpen, amPickBox(), NAFL_SLOT, naflRows(), mineForm, myDeeds, mineDue, mineDays, mineBlock(), mineClick()
- **400-my-path.js** (9 KB): pathMan(), lastDays, pathData(), pathWhere(), pathPlan(), pathPct(), pathHomeCard(), viewPath()
- **410-ask-sheikh.js** (4 KB): askData, tsMs, askLoad(), askUnseen(), viewAsk(), askSend(), adQ, adQLoad(), adQBlock()
- **420-majalis.js** (44 KB): majNext(), majUpcoming(), majFmt, majCard(), MAJ_PL, majPl, majLive, majTab, ytLiveOpen, YT_CH_DEF, fbInfo, ytInfo, ytCh, ytId(), ytList(), recOpen, SAL, salUrl, salPos(), salStart(), salStop(), salUi(), salStTxt, REC_EPS, recLC, recBusy, recEps, recAutoFetch(), recHid, epsOf, recP(), recAuto, hms, ytP, ytRid, ytIv, ytApiP, ytOn, sndUi(), DOCK …
- **425-yt-series.js** (10 KB): YS_DATA, YS, ysLang, ysRid, ysOf, ysEps, ysNotes, ysProg, ysNoteBox(), ysUi(), ysCard(), ysCarry(), ysPick(), viewYS, ysSerCard(), ysNt
- **430-tools.js** (11 KB): DUAS, duaOpen, viewDuas(), KAABA, qiblaDeg(), qbH, qbOn, viewQibla(), qibStart(), hzDone, hz(), hzF, hzToday(), viewHifz(), hijriMonth(), RAM_IT, ramCard(), viewTools(), toolsClick()
- **440-series.js** (4 KB): serSel, serCur, serSet(), viewSeries(), serCards(), adSerBlock(), serClick()
- **450-care.js** (1 KB): careCard()
- **460-lessons-data.js** (18 KB): LESSONS
- **470-lessons-translations-data.js** (248 KB): LTR, lsL, lsDir, lessonGet(), ahLv, ahN, lsAcc
- **480-lesson-aql-data.js** (17 KB): AQL_LV
- **490-covenants-data.js** (7 KB): AHD
- **500-covenants.js** (15 KB): aqT(), trS(), trN, trSim(), trDays, trLog(), trSetStart(), trSlip, trRedo, trU, trPendTxt(), trCard(), trPast(), aqlCard, trClick(), ahdSel, ahdCur
- **510-lesson-ikhlas-data.js** (11 KB): 
- **520-ikhlas.js** (16 KB): niyaOn, niyaT, niyaLast, niyaStart(), niyaToast(), niyaEnd(), madhOpen(), IKQ, IKGOOD, ikS(), ikDone, ikDays(), viewIkhlas(), SIRR_DEF, SIRR_WK, sirrL(), viewSirr(), ikhClick(), ikSettings(), Q2, viewIkhub(), ttsBtn, viewLesson(), AHDAF, ahTab, viewAhdaf(), viewFatur()
- **530-adhan.js** (3 KB): ADZ, adzUnlocked, adzShown, adzP(), adzPlay(), adzStop(), adzUi(), adzTick(), adzBox(), adzClick()
- **540-aamal-simple.js** (19 KB): amDoneOpen, amDlOpen, amMineOpen, amSimple(), amMore(), viewAamal()
- **550-heart-drawing.js** (12 KB): HC, organShade(), HEART_BODY, HEART_PORTS, heartSection(), viewSura(), TQ, tqQuery, tqAskMsg, tqAskBusy, tqAskDraft, TQUI, tqU, tqNorm, tqBlock()
- **560-read-aloud.js** (25 KB): TTS_OK, TTS_LANG, TTS_PBUH, tts, TTS_PREF, TTS_JUNK, ttsVoices, ttsScore(), ttsVoice, ttsRateFor, ttsSecs, ttsUnits, ttsText(), ttsChunks(), ttsMark(), ttsSpeak(), ttsStart(), ttsStop(), ttsToggle(), ttsJump(), ttsRate(), ttsBar(), ttsClick(), viewMethod(), tqSearch(), tqMark(), tqAskSend(), viewNotif(), APP_VER, errLog(), OFFREADY, OFFST, checkOffline(), offlineLine(), prefetchImgs(), bkPending, bkMsg, bkWhen, applyFz(), fzApply() …
- **570-install.js** (6 KB): installEvt, transferMsg, isStandalone(), inPreview(), installParts(), viewInstall(), RM, RM_GO, RM_HOT, rmHot
- **580-map-position.js** (13 KB): RM_PTS, RM_MS, RM_BADGE, RM_ME, rmSeq(), rmParam(), rmShown(), rmAt(), rmCard(), rmLayer(), rmAnim(), rmClick(), endLoaded, endLoad(), viewRoadmap(), rmZoom(), FQ_K, FQ_BY, vdCat, vdCur, vdSt(), vdList, vdTitle, vdPoster, viewFiqh(), viewVideo(), vdBind()
- **590-adhkar-reader.js** (10 KB): adhSize, adhList(), adhState(), ADH_SAME, adhAu(), adTts, MS_SRC, ADA, ADP, AD_RATES, adRate, adMute, AD_IC, adRateTx, adTitle(), adBar(), adMeta(), adPlay(), adStop(), adToggle(), adStep(), adUi(), adClick(), viewAdhkar(), ar2
- **600-personal-dhikr.js** (9 KB): dlList(), dlTotal, dhikrEditor(), dlOpen, run, runTimer, actx, wakeLock, audio(), bell(), chimeWav(), SND, sndInit(), sndUnlock(), sndPlay(), sndStop(), soundStep, soundEnd, keepAwake(), startRun(), tick(), togglePause(), stopRun(), fmtMs, paintRun(), viewDhikrRun()
- **610-khushu-data.js** (63 KB): KHD
- **620-khushu.js** (15 KB): KL, KA, KU, alhRing, khS, khTab, khPr, khRk, khStill, khStillT, khRate, khPN, khDayN, khRuknOf, khNow(), khLogs(), khStats(), khF1, khTabs(), viewKhushu(), khPrep(), khArkan(), khMine(), khAskRow(), khProgDay(), khProg(), khRateHtml(), khRateOpen(), khRateRedraw(), khStillTick(), khClick(), khAfterPray(), khAamalLink(), khMuhLine(), viewKhushuR
- **630-amrad-data.js** (12 KB): AMRAD
- **640-guides-data.js** (12 KB): GUIDES
- **650-illustrations.js** (8 KB): ILC, ilBg(), ilGround, ilClip, ilFig(), ilStar, ilMoon, ilHeart, ilMat, ilKaaba, ilMosque, ilBook, ilTree, ilDrop, ilWater, ilTap, ilHand
- **660-illustrations-data.js** (11 KB): IL
- **670-illustrations-2.js** (7 KB): ilHeadBig, ilArm, IL_BAD, ilBan, SCR_BAN, scrBan, ilFail(), IL_IMG, ilSvg()
- **680-simple-ui.js** (6 KB): SIMPLE, NAV_CLASSIC, NAV_SIMPLE, navSync(), tabS(), SMT, HUBS, IL_ALIAS, viewHub, HT_ALL, htGet(), homeTiles(), htPick(), htEdit(), htMenu(), htLP, htSkip, smGroup, smTiles
- **690-quick-muhasaba.js** (5 KB): QM_ORG, QM_FACE, qmFace, qmDay, QM_PI, qmPrepOn, qmVal, qmDone, QM_EXTRA, qmRows, qmCard()
- **700-tree.js** (4 KB): trDay(), trR, trMemo, treeState(), treeDays(), TREE_ST, TREE_HS, TR_FP, treeArt(), treeCard()
- **710-screen-me.js** (5 KB): meOpen, meG, viewMe()
- **720-screen-heart-cards.js** (2 KB): amI, viewAmrad(), amBind()
- **730-screen-wudu-salat.js** (1 KB): viewGuide()
- **740-lesson-stories.js** (4 KB): ST_MOTIF, ST_ROT, storySlides(), stSpeakTok, stSay(), storyOpen()
- **750-simple-tazkiya.js** (6 KB): TZ_K, tzStage0(), tzUnl(), tzLadder(), tzSCard(), tzMore(), tzLearn(), tzSimple(), qmSlip, QM_REASONS
- **755-maraka.js** (13 KB): MK_AUTO, MK_GO, MK_PR, MK_LV, MK_WIN_N, MK_WIN_IN, mkAnim, mkSnd, mkS(), mkTasks, mkLog, mkDone(), mkWon, mkWins, mkDay(), mkCanJudge(), mkScene(), mkLaugh(), mkResult(), viewMaraka()
- **760-uyub.js** (4 KB): UY, UYN, UY_HEART, UY_LIS, UY_AF, UY_Q, UY_A, UY_W, UY_LV, UY_LC, UY_DO, UY_HAD, UY_RS, UY_WHO, UY_CV, UY_MV, UY_DAY, uyRun, uyOpen, uy(), uyDT, uyNum
- **770-uyub-score.js** (2 KB): uyReason(), uyMuh(), uyCV(), uyScore(), uyLv, uyRank, uyValid(), uyLast, uyPrevValid, uyPend()
- **780-uyub-screens.js** (21 KB): UY_LT, UY_IH, UY_IHC, UY_UJB, uyF, uyProg, uyUjb, uyQ, viewUyub(), uyRes(), uyCurCard(), uyMain(), uyHazm(), uyFault(), uyUjbBox(), uyIntro(), uyDoors(), uyPendCard(), uyTest(), uyResults(), uyChg(), uyBar(), uyRow(), uyCard()
- **790-uyub-sheets.js** (4 KB): uyChips(), uySheet(), uyDone()
- **800-tasmi-engine.js** (4 KB): TS_MARKS, tsKey(), tsLev(), tsSame(), tsCat, TS_IGN, tsNew(), tsFeed(), tsPrompt()
- **810-tasmi.js** (13 KB): RW_N, RWD, RWF, tsMsg, TSR, tsRes, TS_SR, tsSt(), tsLoad(), tsDig, tsAyat(), tsWords(), tsSay, tsSpeak(), tsRec(), tsHear(), tsStart(), tsStop(), tsTick(), tsErr(), tsFath(), tsFlash(), tsDone(), tsPaint(), viewTasmi(), tsClick(), VIEWS, TOPTABS
- **820-audio.js** (15 KB): AU_REPO, AU_EXT, SIRA_K, QIY_K, AQ_K, auScr, auHome, auScrK, AU_T, AU, auCat, auBusy, auErr, auOpen, auLastSave, auSt, auInv, auClean, auFmt, auBuild(), auLoad(), auAll, auFind, MEDIA_BASE, auUrl, auNext(), auPlay(), auToggle(), auSkip(), auMeta(), auPos(), auStore(), AU_IC, auPct(), viewAudio(), auUi(), auClose(), auNowUi(), auClick()
- **830-router.js** (7 KB): tabOf(), ptKind(), skyKind(), render(), go(), NAVH, navBack, navRoute, navUrl(), goRaw()
- **840-events.js** (25 KB): adhAwake(), logOrgan(), applyWird()
- **850-push.js** (12 KB): photoMsg, geoMsg, pushMsg, pushBusy, VAPID, isIOS, pushPrefs(), trPend(), pushDoc(), pushT, pushSync(), pushEnable(), pushDisable(), pushTest(), notifPerm, notifBlockedMsg(), hudurTest(), showHudur(), hudurHash(), pushState(), pushStateLine(), pushInvite(), pushSection(), setLoc(), geoLocate(), setPhoto()
- **860-qa-search.js** (4 KB): qaNorm, qaUnmark(), qaMark(), qaTimer, qaSearch(), qaShare(), miniToast()
- **870-events-misc.js** (5 KB): 
- **875-stats.js** (9 KB): ST_SCR, ST_DAY, ST_MS, ST_KEYS, stOn, stLoad(), ST, stSave(), stMark(), stMile(), stObserve(), stBusy, stFlush(), stLastScr, stData, stBusyR, stRead(), stBlock()
- **880-boot.js** (1 KB): lastSig

## src/css

- 010-base.css
- 020-screens.css
- 030-landscape.css
- 040-home.css
- 050-home-photo.css
- 060-practices.css
- 070-adhkar-audio.css
- 080-roadmap.css
- 090-video.css
- 100-content-editor.css
- 110-my-path.css
- 120-tools.css
- 130-adhan.css
- 140-misc.css
- 150-simple-ui.css
- 160-maraka.css
- 170-yt-series.css

## Other files

- **src/index.html**: the page; `/*@css*/`, `/*@js*/`, `/*@firebase*/` mark where the parts go.
- **src/firebase.js**: accounts and sync (Firebase), loaded as a module.
- **src/sw.js**: the service worker (offline). `murshid-__BUILD__` becomes the build time.
- **src/i18n.json**: translations, one line per Arabic text: `"النص":["en","fr","es","ru","ur"]`.
- **scripts/build.mjs**: checks the code (a syntax error names its file and line) and writes `dist/`.
