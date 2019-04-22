function completeDate(time1, time2, m) {
    var diffyear = time2.getFullYear() - time1.getFullYear()
    var diffmonth = diffyear * 12 + time2.getMonth() - time1.getMonth()
    if (diffmonth < 0) {
        return false
    }
    var diffDay = time2.getDate() - time1.getDate()
    if (diffmonth < m || (diffmonth == m && diffDay <= 0)) {
        if (diffmonth == m && diffDay == 0) {
            var timeA = time1.getHours()*3600 + 60*time1.getMinutes() + time1.getSeconds()
            var timeB = time2.getHours()*3600 + 60*time2.getMinutes() + time2.getSeconds()
            if (timeB - timeA > 0) {
                return false
            }
        }
        return true
    }
    return false
}
completeDate('2010-10-2', '2010-01-4',5)