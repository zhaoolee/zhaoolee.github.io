import os
import frontmatter

def get_md_list(dir_path):
    md_list = []
    dirs = os.listdir(dir_path)
    for i in dirs:
        if os.path.splitext(i)[1] == ".md":   
            md_list.append(os.path.join(dir_path, i))
    print(md_list)
    return md_list


# 获取markdown文件中的内容
def read_md(file_path):
    print("==file_path==", file_path)
    content = ""
    metadata = {}
    with open(file_path) as f:
        post = frontmatter.load(f)
        content = post.content
        metadata = post.metadata
        # print("==>>", post.content)
        print("===>>", post.metadata)
    return (content, metadata)


def main():
    md_list = get_md_list(os.path.join(os.getcwd(), "pi"))
    print("==md_list==", md_list)
    for index, md in enumerate(md_list):
        print("==当前进度==", str(index) +"/"+ str(len(md_list)), '开始同步==', md)
        # 读取md文件信息
        (content, metadata) = read_md(md)
        # 获取title
        title = metadata.get("title", "")
        print("==title==", title)

main()