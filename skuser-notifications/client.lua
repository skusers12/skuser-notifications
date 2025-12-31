local function ShowNotification(data)
    SendNUIMessage({
        action = 'notify',
        id = data.id,
        title = data.title or 'Powiadomienie',
        description = data.description,
        type = data.type or 'info',
        position = data.position or 'top',    
        duration = data.duration or 5000,
        showDuration = data.showDuration,
        style = data.style,  
        icon = data.icon,
        iconColor = data.iconColor,
        sound = data.sound
    })
end


exports('notify', ShowNotification)

RegisterCommand('notifytest', function()
    ShowNotification({
        title = 'Fajna notifka',
        duration = 5000,
        description = 'Skuser jest **sigmom** i `simgom` oraz *obdyp*.',
        position = 'top',
        type = 'success'
    })

    ShowNotification({
        title = 'Fajna notifka',
        duration = 5000,
        description = 'Skuser jest **sigmom** i `simgom` oraz *obdyp*.',
        position = 'bottom',
        type = 'normal'
    })

        ShowNotification({
        title = 'Fajna notifka',
        description = 'Skuser jest **sigmom** i `simgom` oraz *obdyp*.',
        position = 'top-left',
        type = 'error'
    })

        ShowNotification({
        title = 'Fajna notifka',
        description = 'Skuser jest **sigmom** i `simgom` oraz *obdyp*.',
        position = 'top-right',
        type = 'warning'
    })

        ShowNotification({
        title = 'Fajna notifka',
        description = 'Skuser jest **sigmom** i `simgom` oraz *obdyp*.',
        position = 'bottom-left',
        type = 'info'
    })

        ShowNotification({
        title = 'Fajna notifka',
        description = 'Skuser jest **sigmom** i `simgom` oraz *obdyp*.',
        position = 'bottom-right',
        type = 'info'
    })


end)
