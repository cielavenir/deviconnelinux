// original: app.asar/electron_latest.js

;(function () {
  /**
   * kag.init
   */
  tyrano.plugin.kag.init = function () {
    this.kag = this
    var that = this
    this.tyrano.test()
    //if ($.isElectron() && -1 == window.navigator.userAgent.indexOf("TyranoStudio") && !require("electron").remote.app.requestSingleInstanceLock()) {
    if (
      $.isElectron() &&
      -1 == window.navigator.userAgent.indexOf('TyranoStudio') &&
      !window.api.returnSingleInstanceLock()
    ) {
      //if (false) {
      alert($.lang('double_start'))
      window.close()
      void 0 !== navigator.app && navigator.app.exitApp()
    }
    this.parser.loadConfig(function (map_config) {
      that.config = $.extend(!0, that.config, map_config)
      that.checkUpdate(function () {
        that.init_game()
      })
    })
    $('script').each(function () {
      $(this).attr('src') &&
        ((-1 == $(this).attr('src').indexOf('cordova') &&
          -1 == $(this).attr('src').indexOf('phonegap')) ||
          (that.define.FLAG_APRI = !0))
    })
    ;('function' == typeof TyranoPlayer || $.isNWJS()) &&
      (this.tmp.ready_audio = !0)
    var AudioContext = window.AudioContext || window.webkitAudioContext || !1
    AudioContext && (this.tmp.audio_context = new AudioContext())
    try {
      $.getBrowser()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * パッチ適用関連
   */
  tyrano.plugin.kag.checkUpdate = function (call_back) {
    if ($.isNWJS() || $.isElectron())
      if ('false' != this.kag.config.patch_apply_auto) {
        var patch_path = $.localFilePath()
        patch_path = patch_path + '/' + this.kag.config.projectID + '.tpatch'
        this.applyPatch(patch_path, 'true', call_back)
      } else call_back()
    else call_back()
  }

  tyrano.plugin.kag.applyPatch = function (patch_path, flag_reload, call_back) {
    const unzip_path = $.getUnzipPath()
    const local_path = $.localFilePath()
    console.log(unzip_path)
    console.log(local_path)
    console.log(patch_path)
    window.api.applyPatch(unzip_path, local_path, patch_path)
    call_back()
    /*
    var fs = require("fs")
    if (fs.existsSync(patch_path)) {
        var fse = require("fs-extra"),
            _path = require("path"),
            unzip_path = $.getUnzipPath()
        if ("asar" != unzip_path) {
            const AdmZip = require("adm-zip")
            require("path").resolve("./")
            new AdmZip(patch_path).extractAllTo(unzip_path + "/update_tmp", !0)
            fse.copySync(unzip_path + "/update_tmp/", unzip_path + "/")
            fse.removeSync(unzip_path + "/update_tmp")
            fse.removeSync(patch_path)
            $.alert("パッチを適応しました。再起動します。", function () {
                location.reload()
            })
        } else {
            const asar = require("asar")
            let path = __dirname,
                out_path = (fs.readdirSync(path), $.localFilePath())
            if ("darwin" == process.platform) {
                alert("パッチを適応するゲーム実行ファイル（.app）の場所を選択してください。")
                let filenames = require("electron").remote.dialog.showOpenDialogSync(null, {
                    properties: ["openFile"],
                    title: "パッチを適応するゲームの実行ファイル（app）を選択してください。",
                    filters: [{name: "", extensions: ["app"]}],
                })
                if (void 0 === filenames) {
                    alert("パッチの適応を中止します")
                    call_back()
                    return
                }
                path = filenames[0] + "/Contents/Resources/app.asar"
                out_path += "/"
            } else out_path += "/"
            fse.mkdirSync(_path.resolve(out_path + "/update_tmp"))
            ;(async () => {
                await asar.extractAll(_path.resolve(path), _path.resolve(out_path + "/update_tmp/"))
            })()
            new (require("adm-zip"))(patch_path).extractAllTo(_path.resolve(out_path + "update_tmp/"), !0)
            const src = _path.resolve(out_path + "update_tmp/"),
                dest = _path.resolve(path)
            ;(async () => {
                await asar.createPackage(src, dest)
                $.alert($.lang("apply_patch_complete"), function () {
                    fse.removeSync(_path.resolve(patch_path))
                    fse.removeSync(_path.resolve(out_path + "update_tmp"))
                    window.close()
                })
            })()
        }
    } else call_back()
*/
  }

  /**
   * webページ開く
   */
  tyrano.plugin.kag.tag.web = {
    vital: ['url'],
    pm: { url: '' },
    start: function (pm) {
      if (-1 == pm.url.indexOf('http')) {
        window.open(pm.url)
        //else if ($.isNWJS()) {
        //require("nw.gui").Shell.openExternal(pm.url)
      } else if ($.isElectron()) {
        //require("electron").shell.openExternal(pm.url)
        window.api.openWebPage(pm.url)
      } else $.isTyranoPlayer() ? $.openWebFromApp(pm.url) : window.open(pm.url)
      this.kag.ftag.nextOrder()
    },
  }
  tyrano.plugin.kag.ftag.master_tag.web = tyrano.plugin.kag.tag.web
  tyrano.plugin.kag.ftag.master_tag.web.kag = tyrano.plugin.kag

  /**
   * ウィンドウを閉じる
   */
  tyrano.plugin.kag.tag.close = {
    pm: { ask: 'true' },
    start: function (pm) {
      var that = this
      'true' == pm.ask
        ? $.confirm(
            $.lang('exit_game'),
            function () {
              that.close()
            },
            function () {
              that.kag.ftag.nextOrder()
            }
          )
        : this.close()
    },
    close: function () {
      window.close()
      void 0 !== navigator.app && navigator.app.exitApp()
      'undefined' != typeof require &&
        void 0 !== require('nw.gui') &&
        require('nw.gui').Window.get().close()
    },
  }
  tyrano.plugin.kag.ftag.master_tag.close = tyrano.plugin.kag.tag.close
  tyrano.plugin.kag.ftag.master_tag.close.kag = tyrano.plugin.kag

  /**
   * webから更新取得
   */
  tyrano.plugin.kag.tag.check_web_patch = {
    vital: ['url'],
    pm: { url: '', reload: 'false' },
    start: function (pm) {
      var that = this
      $.isNWJS() || $.isElectron()
        ? $.ajax({
            url: pm.url + '?' + Math.floor(1e6 * Math.random()),
            cache: !1,
            dataType: 'json',
            success: function (json) {
              'object' != typeof json && (json = JSON.parse(json))
              that.checkPatch(json, pm)
            },
            error: function (e) {
              console.log(e)
              alert($.lang('patch_not_found', { path: pm.url }))
            },
          })
        : that.kag.ftag.nextOrder()
    },
    checkPatch: function (obj, pm) {
      var that = this
      void 0 === this.kag.variable.sf._patch_version &&
        this.kag.evalScript('sf._patch_version=' + this.kag.config.game_version)
      if (
        parseFloat(this.kag.variable.sf._patch_version) <
        parseFloat(obj.version)
      ) {
        const confirm_message = $.lang('new_patch_found', {
          version: parseFloat(obj.version),
          message: obj.message,
        }).replace(/\n/g, '<br>')
        $.confirm(
          confirm_message,
          function () {
            alert($.lang('apply_web_patch'))
            var http = require('http'),
              fs = require('fs'),
              file = obj.file,
              url = $.getDirPath(pm.url) + file
            ;-1 != url.indexOf('https') && (http = require('https'))
            var patch_path = $.localFilePath()
            patch_path = patch_path + '/' + file
            var outFile = fs.createWriteStream(patch_path)
            http
              .get(url, function (res) {
                res.pipe(outFile)
                res.on('end', function () {
                  outFile.close()
                  that.kag.evalScript('sf._patch_version=' + obj.version)
                  window.close()
                })
              })
              .on('error', function (err) {
                console.log('Error: ', err)
              })
          },
          function () {
            that.kag.ftag.nextOrder()
          }
        )
      } else that.kag.ftag.nextOrder()
      console.log(obj)
    },
  }
  tyrano.plugin.kag.ftag.master_tag.check_web_patch =
    tyrano.plugin.kag.tag.check_web_patch
  tyrano.plugin.kag.ftag.master_tag.check_web_patch.kag = tyrano.plugin.kag
})()

/**
 * jQuery拡張
 */
;(function ($) {
  const storageFolder = '_storage'
  /**
   * 実行環境判定
   * @returns
   */
  $.isElectron = function () {
    if (navigator.userAgent.indexOf('Electron') != -1) {
      return true
    } else {
      return false
    }
  }

  /**
   * PC用の実行パスを取得
   * @returns 実行パス
   */
  $.getExePath = function () {
    //const _app = require("electron").remote.app

    //TyranoStudio.app/Contents/Resources/app
    //let path = _app.getAppPath()
    let path = window.api.returnAppPath()
    let platform = ''

    if (process.platform == 'darwin') {
      const platrofm = 'mac'
      //TyranoStudio-darwin-x64.asar
      if (path.indexOf('.asar') != -1) {
        path = $.replaceAll(path, '/Contents/Resources/app.asar', '')
      } else {
        path = $.replaceAll(path, '/Contents/Resources/app', '')
      }

      path = $.getExtWithFile(path).dir_name
    } else if (process.platform == 'win32') {
      if (path.indexOf('.asar') != -1) {
        path = $.replaceAll(path, '\\resources\\app.asar', '')
      } else {
        path = $.replaceAll(path, '\\resources\\app', '')
      }
    } else if (process.platform == 'linux') {
      if (path.indexOf('.asar') != -1) {
        path = $.replaceAll(path, '/resources/app.asar', '')
      } else {
        path = $.replaceAll(path, '/resources/app', '')
      }
    }
    return path
  }

  $.setStorageFile = function (key, val) {
    val = JSON.stringify(val)
    //var fs = require("fs")

    var out_path = $.getExePath()

    //mac os Sierra 対応
    if (process.execPath.indexOf('var/folders') != -1) {
      out_path = process.env.HOME + '/_TyranoGameData'
      /*
            if (!fs.existsSync(out_path)) {
                fs.mkdirSync(out_path)
            }
            */
      if (!window.api.existFile(out_path)) {
        window.api.makeDir(out_path)
      }
    } else {
      out_path = $.getExePath()
    }

    if (!window.api.existFile(out_path + `/${storageFolder}/`))
      window.api.makeDir(out_path + `/${storageFolder}/`)

    window.api.writeFile(
      out_path + `/${storageFolder}/` + key + '.sav',
      encodeURIComponent(val)
    )
    //fs.writeFileSync(out_path + "/" + key + ".sav", escape(val))
  }

  $.getStorageFile = function (key) {
    try {
      var gv = 'null'
      //var fs = require("fs")
      var out_path = $.getExePath()

      if (process.execPath.indexOf('var/folders') != -1) {
        out_path = process.env.HOME + '/_TyranoGameData'
        if (!window.api.existFile(out_path)) {
          window.api.makeDir(out_path)
        }
      } else {
        out_path = $.getExePath()
      }

      if (!window.api.existFile(out_path + `/${storageFolder}/`))
        window.api.makeDir(out_path + `/${storageFolder}/`)

      if (
        window.api.existFile(out_path + `/${storageFolder}/` + key + '.sav')
      ) {
        var str = window.api.readFile(
          out_path + `/${storageFolder}/` + key + '.sav'
        )
        gv = decodeURIComponent(str)
      } else {
        //Fileが存在しない場合にローカルストレージから読み取る使用は破棄。
        //gv = unescape(localStorage.getItem(key));
      }

      if (gv == 'null') {
        return null
      }
    } catch (e) {
      console.log(e)
      alert($.lang('save_does_not_work'))
      $.confirmSaveClear()
    }

    return gv
  }

  $.clearStorage = function (type, key = '') {
    if (type == 'file') {
      const file = key ? `/${key}.sav` : ''
      const storagePath = $.getExePath() + `/${storageFolder}` + file
      window.api.existFile(storagePath) && window.api.rm(storagePath)
    } else {
      key ? localStorage.removeItem(key) : localStorage.clear()
    }
  }

  $.saveFile = async function (dataUrl) {
    let path
    try {
      path = await window.api.saveFile({ title: $.lang('save_photo'), dataUrl })
      path && $.alert('保存しました。')
    } catch (e) {
      console.log(e)
      $.alert('保存に失敗しました。')
    }
  }

  $.loadText = function (path, cb) {
    const dirname = window.api.returnDirName()
    cb(window.api.readFile(dirname + '/' + path))
  }

  // いま終了時コンファームが有効かどうか
  let is_close_confirm_enabled = false
  let is_set_electron_close_event = false

  $.enableCloseConfirm = () => {
    debugger
    if (is_close_confirm_enabled) return
    is_close_confirm_enabled = true

    // Electron でない場合は簡単
    if (!$.isElectron()) {
      window.onbeforeunload = () => {
        return $.lang('confirm_beforeunload')
      }
      return
    }

    // Electron の場合
    window.onbeforeunload = async e => {
      // 【！】remote は deprecated
      //const {remote} = require("electron")
      //const win = remote.getCurrentWindow()
      //const dialog = remote.dialog
      //const choice = dialog.showMessageBoxSync(win, {
      const choice = await window.api.showDialog({
        type: 'warning',
        buttons: ['OK', 'Cancel'],
        title: document.title,
        message: $.lang('confirm'),
        detail: $.lang('confirm_beforeunload'),
        defaultId: 0,
        cancelId: 1,
      })
      const leave = choice === 0
      if (leave) {
        // void を返すとページの離脱が続行される
        return
      }
      // true を返すとページの離脱がキャンセルされる
      return true
    }
  }
})(jQuery)
