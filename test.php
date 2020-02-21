<?php
if(move_uploaded_file($_FILES['image']['tmp_name'], $target)){
            $task = move_uploaded_file($_FILES['audio']['tmp_name'], $target2);
            if($task){
                     echo "<script>alert(\"The sermon post was succesfully uploaded\")<script>";
                     }
                     else
                     {
                     echo "<script>alert(\"The sermon post update failed\")<script>";
                     }

                     }

        ?>