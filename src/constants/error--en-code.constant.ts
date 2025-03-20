export enum ErrorEnEnum {
  // !公用
  DEFAULT = "0:Unknown error",
  OperationFailed = "Operation failed",
  SERVER_ERROR = "500:Service is busy, please try again later",

  // !核心业务逻辑
  SYSTEM_USER_EXISTS = "1001:System user already exists",
  INVALID_VERIFICATION_CODE = "1002:Invalid verification code",
  INVALID_USERNAME_PASSWORD = "1003:Invalid username or password",
  NODE_ROUTE_EXISTS = "1004:Node route already exists",
  PERMISSION_REQUIRES_PARENT = "1005:Permission must include a parent node",
  ILLEGAL_OPERATION_DIRECTORY_PARENT = "1006:Illegal operation: This node only supports directory-type parent nodes",
  ILLEGAL_OPERATION_CANNOT_CONVERT_NODE_TYPE = "1007:Illegal operation: Node type cannot be directly converted",
  ROLE_HAS_ASSOCIATED_USERS = "1008:This role has associated users, please delete associated users first",
  DEPARTMENT_HAS_ASSOCIATED_USERS = "1009:This department has associated users, please delete associated users first",
  DEPARTMENT_HAS_ASSOCIATED_ROLES = "1010:This department has associated roles, please delete associated roles first",
  PASSWORD_MISMATCH = "1011:Old password does not match the original password",
  LOGOUT_OWN_SESSION = "1012:To log out yourself, please exit from the top-right corner",
  NOT_ALLOWED_TO_LOGOUT_USER = "1013:Not allowed to log out this user",
  PARENT_MENU_NOT_FOUND = "1014:Parent menu does not exist",
  DEPARTMENT_HAS_CHILD_DEPARTMENTS = "1015:This department has child departments, please delete child departments first",
  SYSTEM_BUILTIN_FUNCTION_NOT_ALLOWED = "1016:System built-in functions are not allowed to be modified",
  USER_NOT_FOUND = "1017:User not found",
  UNABLE_TO_FIND_DEPARTMENT_FOR_USER = "1018:Unable to find the department for the current user",
  DEPARTMENT_NOT_FOUND = "1019:Department not found",
  PARAMETER_CONFIG_KEY_EXISTS = "1022:Parameter configuration key-value pair already exists",
  DEFAULT_ROLE_NOT_FOUND = "1023:Assigned default role does not exist",

  // !身份验证与授权
  INVALID_LOGIN = "1101:Invalid login, please log in again",
  NO_PERMISSION = "1102:No permission to access",
  ONLY_ADMIN_CAN_LOGIN = "1103:Only administrators can log in",
  REQUEST_INVALIDATED = "1104:Current request is invalid",
  ACCOUNT_LOGGED_IN_ELSEWHERE = "1105:Your account has been logged in elsewhere",
  GUEST_ACCOUNT_RESTRICTED_OPERATION = "1106:Guest accounts are not allowed to perform this operation",
  REQUESTED_RESOURCE_NOT_FOUND = "1107:The requested resource does not exist",
  NO_LOGIN = "1108:Please log in again",

  // !限流
  TOO_MANY_REQUESTS = "1201:Too many requests, please try again in one minute",
  MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY = "1202:Maximum 5 verification codes can be sent per day",
  VERIFICATION_CODE_SEND_FAILED = "1203:Verification code sending failed",

  // !系统定时任务
  INSECURE_MISSION = "1301:Insecure mission, ensure execution by adding @Mission annotation",
  EXECUTED_MISSION_NOT_FOUND = "1302:Executed mission not found",
  MISSION_EXECUTION_FAILED = "1303:Mission execution failed",
  MISSION_NOT_FOUND = "1304:Mission not found",

  // !特定的业务逻辑
  // src\socket\shared\auth.gateway.ts
  AuthenticationFailed = "Authentication failed",
  // src\shared\database\constraints\unique.constraint.ts
  DuplicateRecordExists = "Duplicate record exists",
  // src\modules\user\dto\password.dto.ts
  InvalidPasswordFormat = "Invalid password format",
  PasswordRequirements = "Password must contain both letters and numbers, 6-16 characters in length",
  // src\modules\user\user.service.ts
  CannotDeleteRootUser = "Cannot delete root user",
  // src\modules\system\role\role.service.ts
  CannotDeleteSuperAdmin = "Cannot delete super administrator",
  // src\modules\system\role\role.dto.ts
  RoleValueLengthTooShort = "Role value length cannot be less than 2 characters",
  RoleValueAlphanumericOnly = "Role value can only contain letters and numbers",
  RoleNameLengthTooShort = "Role name length cannot be less than 2 characters",
  // src\modules\system\role\role.controller.ts
  RoleHasAssociatedUsers = "Role has associated users and cannot be deleted",
  // src\modules\system\param-config\param-config.dto.ts
  KeyNameAlreadyExists = "Key name already exists",
  // src\modules\system\menu\menu.controller.ts
  MenuHasAssociatedRoles = "Menu has associated roles and cannot be deleted",
  DictionaryNotRepeatable = "Dictionary entries cannot be duplicated",
  // src\modules\system\dict-item\dict-type.dto.ts
  DuplicateDictionaryName = "Dictionary type with same name already exists",
  DuplicateEnglishDictionaryName = "Dictionary type with same English name already exists",
  DuplicateDictionaryCode = "Dictionary type with same code already exists",
  // src\modules\system\dict-item\dict-item.dto.ts
  DuplicateDictionaryItemName = "Dictionary item with same name already exists",
  DuplicateEnglishDictionaryItemName = "Dictionary item with same English name already exists",
  DuplicateDictionaryItemCode = "Dictionary item with same code already exists",
  // src\helper\crud\base.service.ts
  RecordNotFound = "Record not found",
  // src\helper\crud\base.service.ts
  RequestTimeout = "Request timeout",
  // src\modules\device\device.service.ts
  DuplicateDeviceAliasOrSN = "Cannot add devices with duplicate alias or SN",
  DictionaryMissingFields = "Required fields device_type, model, or status not found in dictionary",
  // src\modules\e_table\e_table.service.ts
  TableNameExists = "Table name already exists",
  DuplicateChannelNumber = "Duplicate channel number detected",
  // src\modules\hop-freq\hop-freq.service.ts
  DataLimitExceeded = "Total data (new + existing) exceeds system limit of 80 entries. Please reduce data or clean up existing entries",
  // src\modules\hop-freq\hop-freq.service.ts
  UniqueAliasRequired = "Alias must be unique, please provide an unused name",
  TypeNoLongerExists = "Selected type no longer exists, please refresh page or choose valid type",
  // src\modules\network-template\network-template.service.ts
  DuplicateNetworkTemplateName = "Network template name already exists",
  // src\modules\p_shot_message\p_shot_message.service.ts
  DuplicateSMSContent = "SMS content already exists, please avoid duplicate submissions",
  SystemDataLimitReached = "System has reached maximum data limit (100 entries). Delete existing entries to continue",
  // src\modules\pm-master\pm-master.service.ts
  DuplicateTaskTemplateName = "Task template name already exists",
  // src\modules\pm-sub\pm-sub.service.ts
  DuplicateSubtaskName = "Subtask name already exists",
  // src\modules\system\dict-item\dict-item.service.ts
  InvalidDictionaryFieldValue = "Field value is not within current dictionary scope. Select valid entry or update dictionary",
  // src\modules\system\dict-type\dict-type.service.ts
  UniqueDictionaryKeyValueRequired = "Dictionary keys and values must be unique",
  // src\modules\system\param-config\param-config.dto.ts
  DuplicateKeyName = "Key name already exists",
  // src\modules\wave_device_config\wave_device_config.service.ts
  OperationFailedDictionaryOrParameterError = "Operation failed: Possible dictionary mismatch or parameter error. Please verify and retry",

  // ! 中间价
  // src\utils\ip.util.ts
  InternalIP = "Internal IP",
  ThirdPartyApiRequestFailed = "Third-party API request failed",
  // src\utils\ip.util.ts
  DemoModeOperationNotAllowed = "Operation not allowed in demo mode",
  // src\socket\base.gateway.ts
  WebSocketDisconnected = "WebSocket disconnected",
  WebSocketConnected = "WebSocket connected",
  // src\shared\redis\redis-subpub.ts
  ReceiveEvent = "Received event: ",
  PublishEvent = "Published event: ",
  // src\shared\mailer\mailer.service.ts
  VerificationCode = "Verification code",
  // src\shared\helper\cron.service.ts
  DeleteExpired = "Delete expired",
  IssuedAt = "Issued at",
  Deleted = "Deleted",
  ExpiredItemsCleared = "expired items cleared",
  StartScanningClearExpired = "Start scanning and clearing expired",
  // src\modules\system\task\task.service.ts
  TaskNotFound = "Task not found",
  // src\modules\sse\sse.controller.ts
  Closed = "Closed",
  // src\common\interceptors\logging.interceptor.ts
  Response = "Response",
  Request = "Request",
  // src\modules\system\task\task.dto.ts
  DuplicateTaskName = "Task with same name already exists",
  CronExpressionRequired = "Cron expression is required, please provide valid expression",
  // src\modules\system\task\task.service.ts
  TaskNotFoundById = "No related task found, please verify task ID and retry",
  // src\modules\system\task\task.service.ts
  ScheduledTaskParametersMissing = "Scheduled task parameters are missing, please provide required parameters to stop and delete task",
  // src\modules\system\task\task.service.ts
  ScheduledTaskNotFound = "Specified scheduled task does not exist",
  // src\modules\tasks\jobs\email.job.ts
  EmailTaskParametersMissing = "Email task parameters are missing, please check and provide required information",
  // src\modules\tasks\jobs\http-request.job.ts
  HttpRequestTaskParametersMissing = "HTTP request task parameters are missing, please check and provide required parameters",

  //! 邮箱发送 和 文件上传 暂不需要
  // src\modules\tools\upload\upload.dto.ts
  InvalidFileType = "Invalid file type",
  // src\modules\tools\upload\upload.controller.ts
  UploadFailed = "Upload failed",
  // src\modules\auth\dto\captcha.dto.ts  用于邮件发送
  InvalidPhoneNumberFormat = "Invalid phone number format",
  InvalidEmailFormat = "Invalid email format",
}
