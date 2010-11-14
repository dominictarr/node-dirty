

exports['rm and key is not available'] = function (test){
  var dirty = require('dirty')('test.dirty')
  dirty.on('load', c)
  function c(){
    var k = 'hi'
      , v = {sadfas:'sdfsadfs'}
    dirty.set(k,v)
    test.equal(dirty.get(k),v)
    dirty.rm(k)
    test.equal(dirty.get(k),undefined)
    test.finish()
  }
}

exports['rm and key is not available in memory'] = function (test){
  var dirty = require('dirty')()
  var k = 'hi'
    , v = {sadfas:'sdfsadfs'}
  dirty.set(k,v)
  test.equal(dirty.get(k),v)
  dirty.rm(k)
  test.equal(dirty.get(k),undefined)
  test.finish()
}

exports['two in memory db cannot see each other'] = function (test){
  var dirty1 = require('dirty')()
  var dirty2 = require('dirty')()
  var k = 'hi'
    , v = {sadfas:'sdfsadfs'}
  dirty1.set(k,v)
  test.equal(dirty1.get(k),v)
  test.notEqual(dirty2.get(k),v)
//  dirty2.rm(k)
//  test.equal(dirty.get(k),undefined)
  test.finish()
}

function checkCallbacks(test,db,finish){
  var k = Math.round(Math.random()*100)
    , v = Math.round(Math.random()*1000000)
    , timer = setTimeout(function (){
        test.ok(false,"checkCallbacks timed out. callbacks where not called!")
      },1000)
  db.on('load',c)

  function c(){
    db.set(k,v,c)

    function c(){
      console.log('set' + db.path)
      test.equal(db.get(k),v)
      console.log('get' + db.path)
      db.rm(k,c)

      function c (){
        console.log('get' + db.path)
        clearTimeout(timer)
        finish()
  }}}
}


exports['in file database does callbacks'] = function (test){
  var fileD = require('dirty')('test.drity')
    checkCallbacks(test,fileD,test.finish)
}

exports['in memory database does callbacks'] = function (test){
  var memD = require('dirty')()
    checkCallbacks(test,memD,test.finish)
}


