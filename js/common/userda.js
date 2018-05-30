
				var LS;
			

				(function(w, localStorage) { //封装LS，对外提供接口
					var f = function() {
						return null;
					};
					w.LS = localStorage ? {
						setItem: function(key, value) {
							//fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
							if(this.getItem(key) !== undefined)
								this.removeItem(key);
							localStorage.setItem(key, value);
						},
						//查询不存在的key时，有的浏览器返回null，这里统一返回undefined
						getItem: function(key) {
							var v = localStorage.getItem(key);
							return v === null ? undefined : v;
						},
						removeItem: function(key) {
							localStorage.removeItem(key);
						},
						clearItem: function() {
							localStorage.clear();
						},
						each: function(callback) {
							var list = this.obj(),
								fn = callback || function() {},
								key;
							for(key in list)
								if(fn.call(this, key, this.getItem(key)) === false)
									break;
						},
						obj: function() {
							var list = {},
								i = 0,
								n, key;
							if(localStorage.isVirtualObject) {
								list = localStorage.key(-1);
							} else {
								n = localStorage.length;
								for(; i < n; i++) {
									key = localStorage.key(i);
									list[key] = this.get(key);
								}
							}
							return list;
						}
					} : {
						set: f,
						get: f,
						remove: f,
						clear: f,
						each: f,
						obj: f
					}; //如果都不支持则所有方法返回null
				})(window, LS || window.localStorage); //这里优先使用自定义的LS
		
			