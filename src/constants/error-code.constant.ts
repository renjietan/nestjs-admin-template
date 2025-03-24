export enum ErrorEnum {
  // !公用
  DEFAULT = '0:未知错误',
  OperationFailed = '500:操作失败',
  SERVER_ERROR = '500:服务繁忙，请稍后再试',
  OperationSuccess = '操作成功',

  // !核心业务逻辑
  SYSTEM_USER_EXISTS = '1001:系统用户已存在',
  INVALID_VERIFICATION_CODE = '1002:验证码填写有误',
  INVALID_USERNAME_PASSWORD = '1003:用户名密码有误',
  NODE_ROUTE_EXISTS = '1004:节点路由已存在',
  PERMISSION_REQUIRES_PARENT = '1005:权限必须包含父节点',
  ILLEGAL_OPERATION_DIRECTORY_PARENT = '1006:非法操作：该节点仅支持目录类型父节点',
  ILLEGAL_OPERATION_CANNOT_CONVERT_NODE_TYPE = '1007:非法操作：节点类型无法直接转换',
  ROLE_HAS_ASSOCIATED_USERS = '1008:该角色存在关联用户，请先删除关联用户',
  DEPARTMENT_HAS_ASSOCIATED_USERS = '1009:该部门存在关联用户，请先删除关联用户',
  DEPARTMENT_HAS_ASSOCIATED_ROLES = '1010:该部门存在关联角色，请先删除关联角色',
  PASSWORD_MISMATCH = '1011:旧密码与原密码不一致',
  LOGOUT_OWN_SESSION = '1012:如想下线自身可右上角退出',
  NOT_ALLOWED_TO_LOGOUT_USER = '1013:不允许下线该用户',
  PARENT_MENU_NOT_FOUND = '1014:父级菜单不存在',
  DEPARTMENT_HAS_CHILD_DEPARTMENTS = '1015:该部门存在子部门，请先删除子部门',
  SYSTEM_BUILTIN_FUNCTION_NOT_ALLOWED = '1016:系统内置功能不允许操作',
  USER_NOT_FOUND = '1017:用户不存在',
  UNABLE_TO_FIND_DEPARTMENT_FOR_USER = '1018:无法查找当前用户所属部门',
  DEPARTMENT_NOT_FOUND = '1019:部门不存在',
  PARAMETER_CONFIG_KEY_EXISTS = '1022:参数配置键值对已存在',
  DEFAULT_ROLE_NOT_FOUND = '1023:所分配的默认角色不存在',

  // !身份验证与授权
  INVALID_LOGIN = '1101:登录无效，请重新登录',
  NO_PERMISSION = '1102:无权限访问',
  ONLY_ADMIN_CAN_LOGIN = '1103:不是管理员，无法登录',
  REQUEST_INVALIDATED = '1104:当前请求已失效',
  ACCOUNT_LOGGED_IN_ELSEWHERE = '1105:您的账号已在其他地方登录',
  GUEST_ACCOUNT_RESTRICTED_OPERATION = '1106:游客账号不允许操作',
  REQUESTED_RESOURCE_NOT_FOUND = '1107:所请求的资源不存在',
  NO_LOGIN = '1108:请重新登录',

  // !邮件发送限流
  TOO_MANY_REQUESTS = '1201:请求频率过快，请一分钟后再试',
  MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY = '1202:一天最多发送5条验证码',
  VERIFICATION_CODE_SEND_FAILED = '1203:验证码发送失败',

  // !系统定时任务
  INSECURE_MISSION = '1301:不安全的任务，确保执行的加入@Mission注解',
  EXECUTED_MISSION_NOT_FOUND = '1302:所执行的任务不存在',
  MISSION_EXECUTION_FAILED = '1303:任务执行失败',
  MISSION_NOT_FOUND = '1304:任务不存在',

  // !特定的业务逻辑
  // src\socket\shared\auth.gateway.ts
  AuthenticationFailed = '500:认证失败',
  // src\shared\database\constraints\unique.constraint.ts
  DuplicateRecordExists = '500:已存在相同的',
  // src\modules\user\dto\password.dto.ts
  InvalidPasswordFormat = '500:密码格式不正确',
  PasswordRequirements = '500:密码必须包含数字、字母,长度为6-16',
  // src\modules\user\user.service.ts
  CannotDeleteRootUser = '500:不能删除root用户',
  // src\modules\system\role\role.service.ts
  CannotDeleteSuperAdmin = '500:不能删除超级管理员',
  // src\modules\system\role\role.dto.ts
  RoleValueLengthTooShort = '500:角色值长度不能小于2',
  RoleValueAlphanumericOnly = '500:角色值只能包含字母和数字',
  RoleNameLengthTooShort = '500:角色名称长度不能小于2',
  // src\modules\system\role\role.controller.ts
  RoleHasAssociatedUsers = '500:该角色存在关联用户，无法删除',
  // src\modules\system\param-config\param-config.dto.ts
  KeyNameAlreadyExists = '500:该键名已存在',
  // src\modules\system\menu\menu.controller.ts
  MenuHasAssociatedRoles = '500:该菜单存在关联角色，无法删除',
  // src\modules\system\dict-item\dict-type.dto.ts
  DuplicateDictionaryName = '500:已存在相同名称的字典类型',
  DuplicateEnglishDictionaryName = '500:已存在相同英文名称的字典类型',
  DuplicateDictionaryCode = '500:已存在相同编码的字典',
  // src\modules\system\dict-item\dict-item.dto.ts
  DuplicateDictionaryItemName = '500:已存在相同名称的字典项',
  DuplicateEnglishDictionaryItemName = '500:已存在相同英文名称的字典项',
  DuplicateDictionaryItemCode = '500:已存在相同编码的字典项',
  // src\helper\crud\base.service.ts
  RecordNotFound = '500:未找到该记录',
  // src\common\interceptors\timeout.interceptor.ts
  RequestTimeout = '请求超时',
  // src\modules\device\device.service.ts
  DuplicateDeviceAliasOrSN = '500:不可添加【别名】或【SN】相同的设备',
  // src\modules\e_table\e_table.service.ts
  TableNameExists = '500:已存在相同名称的表名',
  DuplicateChannelNumber = '500:已存在相同的信道号',
  // src\modules\hop-freq\hop-freq.service.ts
  DataLimitExceeded = '500:当前数据总量(新增数据 + 现有数据)已超过80条,已达到系统上限。请减少新增数据或清理现有数据后再试',
  UniqueAliasRequired = '500:别名必须唯一,请重新输入一个未被使用的名称',
  TypeNoLongerExists = '500:所选类型不存在，请重新选择有效类型',
  HFTableNameNotExists = "500:跳频表已不存在,请刷新页面后,再试一次",
  // src\modules\network-template\network-template.service.ts
  DuplicateNetworkTemplateName = '500:已存在相同名称的网络模板',
  // src\modules\p_shot_message\p_shot_message.service.ts
  DuplicateSMSContent = '500:短信内容已存在，请勿重复提交',
  SystemDataLimitReached = '500:系统数据已达上限(100条)，无法继续添加。请删除部分数据后重试',
  // src\modules\pm-master\pm-master.service.ts
  DuplicateTaskTemplateName = '500:已存在相同名称的任务规划模板',
  // src\modules\pm-sub\pm-sub.service.ts
  DuplicateSubtaskName = '500:已存在名称相同的子任务',
  // src\modules\system\dict-item\dict-item.service.ts
  InvalidDictionaryFieldValue = '500:所选的值不在当前字典范围内，请选择有效的字典项或更新字典',
  // src\modules\system\dict-type\dict-type.service.ts
  UniqueDictionaryKeyValueRequired = '500:字典键、值必须唯一，请勿重复添加',
  // src\modules\wave_device_config\wave_device_config.service.ts
  OperationFailedDictionaryOrParameterError = '500:操作失败，原因可能是字典不存在或传入参数有误，请检查后重试',
  InvalidIdFormat = 'id验证失败',

  // ! 中间价
  // src\utils\ip.util.ts
  InternalIP = '内网IP',
  ThirdPartyApiRequestFailed = '500:第三方接口请求失败',
  // src\utils\permission.util.ts
  DemoModeOperationNotAllowed = '500:演示模式下不允许操作',
  // src\socket\base.gateway.ts
  WebSocketDisconnected = '500:WebSocket 断开',
  WebSocketConnected = 'WebSocket 已连接',
  // src\shared\redis\redis-subpub.ts
  ReceiveEvent = '接收事件：',
  PublishEvent = '发布事件：',
  // src\shared\mailer\mailer.service.ts
  VerificationCode = '验证码',
  // src\shared\helper\cron.service.ts
  DeleteExpired = '删除过期的',
  IssuedAt = '签发于',
  Deleted = '删除了',
  ExpiredItemsCleared = '个过期的',
  StartScanningClearExpired = '开始扫表，清除过期的',
  // src\modules\system\task\task.service.ts
  TaskNotFound = '500:指定的定时任务不存在',
  // src\modules\sse\sse.controller.ts
  Closed = '已关闭',
  // src\common\interceptors\logging.interceptor.ts
  Response = '响应',
  Request = '请求',
  // src\modules\system\task\task.dto.ts
  DuplicateTaskName = '500:已存在相同名称的任务',
  CronExpressionRequired = '500:Cron表达式不能为空，请输入有效的表达式',
  // src\modules\system\task\task.service.ts
  TaskNotFoundById = '500:未找到相关任务,请检查任务id后重试',
  ScheduledTaskParametersMissing = '500:定时任务参数为空，请填写必要参数以停止和删除任务',
  ScheduledTaskNotFound = '500:指定的定时任务不存在',
  // src\modules\tasks\jobs\email.job.ts
  EmailTaskParametersMissing = '500:邮件发送任务参数为空，请检查并补充必要信息',
  // src\modules\tasks\jobs\http-request.job.ts
  HttpRequestTaskParametersMissing = '500:HTTP 请求任务参数为空，请检查并补充必要参数',

  // ! 邮箱发送 和 文件上传 暂不需要
  // src\modules\tools\upload\upload.dto.ts
  InvalidFileType = '500:文件类型不正确',
  // src\modules\tools\upload\upload.controller.ts
  UploadFailed = '500:上传失败',
  // src\modules\auth\dto\captcha.dto.ts  用于邮件发送
  InvalidPhoneNumberFormat = '500:手机号格式不正确',
  InvalidEmailFormat = '500:邮箱格式不正确',
}
