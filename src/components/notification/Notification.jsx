import {Toaster, toaster} from "../../ui/toaster"
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearNotification} from "./notificationSlicer.js";


const Notification = () => {
  const dispatch = useDispatch();
  const type = useSelector(state => state.notification.type);
  const message = useSelector(state => state.notification.message);

  useEffect(() => {
    if (type) {
      toaster.create({
        title: message,
        type: type
      });
    }
    return () => dispatch(clearNotification())
  }, [message, type, dispatch]);

  return (
    <div>
      <Toaster/>
    </div>
  );
}

export default Notification;